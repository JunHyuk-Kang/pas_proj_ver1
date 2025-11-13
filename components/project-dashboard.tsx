"use client"

import { useState } from "react"
import type { Project, ProjectDocument } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Loader2, Users, UserPlus, Mail, Trash2 } from "lucide-react"
import { saveProjects, loadProjects } from "@/lib/storage"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProjectDashboardProps {
  project: Project
  onUpdateProject: (project: Project) => void
}

export function ProjectDashboard({ project, onUpdateProject }: ProjectDashboardProps) {
  const [generating, setGenerating] = useState<string | null>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "member" as const })

  const generateDocument = async (type: ProjectDocument["type"]) => {
    setGenerating(type)
    try {
      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          projectData: project,
          chatHistory: project.chatHistory,
        }),
      })

      const { content } = await response.json()

      const titles = {
        proposal: "프로젝트 기획서",
        checklist: "준비물 체크리스트",
        curriculum: "교육 커리큘럼",
        "safety-guide": "안전 가이드",
      }

      const newDoc: ProjectDocument = {
        id: Date.now().toString(),
        type,
        title: titles[type],
        content,
        generatedAt: new Date().toISOString(),
      }

      const updated = {
        ...project,
        documents: [...project.documents, newDoc],
        updatedAt: new Date().toISOString(),
      }

      const projects = loadProjects()
      const updatedProjects = projects.map((p) => (p.id === project.id ? updated : p))
      saveProjects(updatedProjects)
      onUpdateProject(updated)
    } finally {
      setGenerating(null)
    }
  }

  const downloadDocument = (doc: ProjectDocument) => {
    const blob = new Blob([doc.content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${doc.title}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const addTeamMember = () => {
    if (!newMember.name || !newMember.email) return

    const member = {
      id: Date.now().toString(),
      ...newMember,
    }

    const updated = {
      ...project,
      teamMembers: [...project.teamMembers, member],
      updatedAt: new Date().toISOString(),
    }

    const projects = loadProjects()
    const updatedProjects = projects.map((p) => (p.id === project.id ? updated : p))
    saveProjects(updatedProjects)
    onUpdateProject(updated)

    setNewMember({ name: "", email: "", role: "member" })
    setShowAddMember(false)
  }

  const removeMember = (memberId: string) => {
    const updated = {
      ...project,
      teamMembers: project.teamMembers.filter((m) => m.id !== memberId),
      updatedAt: new Date().toISOString(),
    }

    const projects = loadProjects()
    const updatedProjects = projects.map((p) => (p.id === project.id ? updated : p))
    saveProjects(updatedProjects)
    onUpdateProject(updated)
  }

  const documentTypes: Array<{ type: ProjectDocument["type"]; label: string; desc: string }> = [
    { type: "proposal", label: "기획서", desc: "전체 프로젝트 개요와 계획" },
    { type: "checklist", label: "체크리스트", desc: "준비물 및 확인사항" },
    { type: "curriculum", label: "커리큘럼", desc: "상세 교육 프로그램 일정" },
    { type: "safety-guide", label: "안전 가이드", desc: "안전 및 문화 주의사항" },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h2>
        <p className="text-gray-600">
          {project.country} · {project.targetAge} · {project.theme}
        </p>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="documents">문서</TabsTrigger>
          <TabsTrigger value="team">팀 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">문서 생성</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {documentTypes.map(({ type, label, desc }) => {
                const existing = project.documents.find((d) => d.type === type)
                return (
                  <Card key={type} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{label}</h4>
                        <p className="text-sm text-gray-600">{desc}</p>
                      </div>
                      {existing && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          생성됨
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => generateDocument(type)}
                      disabled={generating !== null}
                    >
                      {generating === type ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          생성 중...
                        </>
                      ) : existing ? (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          다시 생성
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          생성하기
                        </>
                      )}
                    </Button>
                  </Card>
                )
              })}
            </div>
          </Card>

          {project.documents.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">생성된 문서</h3>
              <div className="space-y-3">
                {project.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.title}</h4>
                        <p className="text-sm text-gray-600">{new Date(doc.generatedAt).toLocaleString("ko-KR")}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => downloadDocument(doc)}>
                      <Download className="w-4 h-4 mr-2" />
                      다운로드
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">팀원 관리</h3>
              <Button onClick={() => setShowAddMember(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                팀원 추가
              </Button>
            </div>

            {project.teamMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>아직 팀원이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {project.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name[0]}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span>{member.email}</span>
                          <Badge variant="outline" className="ml-2">
                            {member.role === "leader" ? "리더" : "멤버"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeMember(member.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>팀원 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>이름</Label>
              <Input
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="이름을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label>이메일</Label>
              <Input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddMember(false)} className="flex-1">
                취소
              </Button>
              <Button onClick={addTeamMember} className="flex-1">
                추가
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
