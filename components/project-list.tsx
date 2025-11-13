"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/lib/types"
import { MapPin, Calendar, Users, Trash2 } from "lucide-react"
import { saveProjects, saveCurrentProject } from "@/lib/storage"

interface ProjectListProps {
  projects: Project[]
  onSelectProject: (id: string) => void
  onDeleteProject: (id: string) => void
}

export function ProjectList({ projects, onSelectProject, onDeleteProject }: ProjectListProps) {
  const handleSelect = (id: string) => {
    saveCurrentProject(id)
    onSelectProject(id)
  }

  const handleDelete = (id: string) => {
    if (confirm("정말 이 프로젝트를 삭제하시겠습니까?")) {
      const updated = projects.filter((p) => p.id !== id)
      saveProjects(updated)
      saveCurrentProject(null)
      onDeleteProject(id)
    }
  }

  const getStatusBadge = (status: Project["status"]) => {
    const variants = {
      planning: { label: "기획중", color: "bg-blue-100 text-blue-700" },
      "in-progress": { label: "진행중", color: "bg-yellow-100 text-yellow-700" },
      completed: { label: "완료", color: "bg-green-100 text-green-700" },
    }
    const { label, color } = variants[status]
    return <Badge className={color}>{label}</Badge>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer relative group"
          onClick={() => handleSelect(project.id)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(project.id)
            }}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>

          <div className="mb-4">{getStatusBadge(project.status)}</div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{project.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                {project.targetAge} · {project.theme}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.createdAt).toLocaleDateString("ko-KR")}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>팀원 {project.teamMembers.length}명</span>
              <span>문서 {project.documents.length}개</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
