"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, MessageSquare, FileText, BookOpen } from "lucide-react"
import { ProjectList } from "@/components/project-list"
import { NewProjectDialog } from "@/components/new-project-dialog"
import { ChatInterface } from "@/components/chat-interface"
import { ProjectDashboard } from "@/components/project-dashboard"
import { CaseStudyLibrary } from "@/components/case-study-library"
import { loadProjects, loadCurrentProjectId } from "@/lib/storage"
import type { Project } from "@/lib/types"

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<"list" | "chat" | "dashboard" | "cases">("list")
  const [showNewProject, setShowNewProject] = useState(false)

  useEffect(() => {
    const loadedProjects = loadProjects()
    setProjects(loadedProjects)

    const currentId = loadCurrentProjectId()
    if (currentId && loadedProjects.some((p) => p.id === currentId)) {
      setCurrentProjectId(currentId)
      setActiveView("chat")
    }
  }, [])

  const currentProject = projects.find((p) => p.id === currentProjectId)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PAS 봉사단 기획 어시스턴트</h1>
                <p className="text-sm text-gray-600">해외교육봉사 프로그램 설계 도우미</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={activeView === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView("list")}
              >
                프로젝트
              </Button>
              {currentProject && (
                <>
                  <Button
                    variant={activeView === "chat" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveView("chat")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    AI 채팅
                  </Button>
                  <Button
                    variant={activeView === "dashboard" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveView("dashboard")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    대시보드
                  </Button>
                </>
              )}
              <Button
                variant={activeView === "cases" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView("cases")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                사례집
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {activeView === "list" && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">나의 프로젝트</h2>
                <p className="text-gray-600 mt-1">AI와 함께 해외교육봉사를 기획하고 관리하세요</p>
              </div>
              <Button onClick={() => setShowNewProject(true)}>
                <Plus className="w-4 h-4 mr-2" />새 프로젝트
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">첫 프로젝트를 시작하세요</h3>
                <p className="text-gray-600 mb-6">AI 어시스턴트와 함께 해외교육봉사 프로그램을 기획해보세요</p>
                <Button onClick={() => setShowNewProject(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  프로젝트 만들기
                </Button>
              </Card>
            ) : (
              <ProjectList
                projects={projects}
                onSelectProject={(id) => {
                  setCurrentProjectId(id)
                  setActiveView("chat")
                }}
                onDeleteProject={(id) => {
                  const updated = projects.filter((p) => p.id !== id)
                  setProjects(updated)
                  if (currentProjectId === id) {
                    setCurrentProjectId(null)
                    setActiveView("list")
                  }
                }}
              />
            )}
          </div>
        )}

        {activeView === "chat" && currentProject && (
          <ChatInterface
            project={currentProject}
            onUpdateProject={(updated) => {
              const updatedProjects = projects.map((p) => (p.id === updated.id ? updated : p))
              setProjects(updatedProjects)
            }}
          />
        )}

        {activeView === "dashboard" && currentProject && (
          <ProjectDashboard
            project={currentProject}
            onUpdateProject={(updated) => {
              const updatedProjects = projects.map((p) => (p.id === updated.id ? updated : p))
              setProjects(updatedProjects)
            }}
          />
        )}

        {activeView === "cases" && <CaseStudyLibrary />}
      </main>

      <NewProjectDialog
        open={showNewProject}
        onOpenChange={setShowNewProject}
        onCreateProject={(project) => {
          const updated = [...projects, project]
          setProjects(updated)
          setCurrentProjectId(project.id)
          setActiveView("chat")
        }}
      />
    </div>
  )
}
