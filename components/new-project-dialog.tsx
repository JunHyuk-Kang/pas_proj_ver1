"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Project } from "@/lib/types"
import { saveProjects, loadProjects, saveCurrentProject } from "@/lib/storage"

interface NewProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateProject: (project: Project) => void
}

export function NewProjectDialog({ open, onOpenChange, onCreateProject }: NewProjectDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    targetAge: "",
    theme: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newProject: Project = {
      id: Date.now().toString(),
      ...formData,
      status: "planning",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      teamMembers: [],
      chatHistory: [],
      documents: [],
    }

    const projects = loadProjects()
    const updated = [...projects, newProject]
    saveProjects(updated)
    saveCurrentProject(newProject.id)

    onCreateProject(newProject)
    onOpenChange(false)

    setFormData({
      name: "",
      country: "",
      targetAge: "",
      theme: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>새 프로젝트 만들기</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">프로젝트명</Label>
            <Input
              id="name"
              placeholder="예: 2025 베트남 교육봉사"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">대상 국가</Label>
            <Input
              id="country"
              placeholder="예: 베트남, 캄보디아, 필리핀 등"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAge">대상 연령</Label>
            <Input
              id="targetAge"
              placeholder="예: 초등학생 (8-12세)"
              value={formData.targetAge}
              onChange={(e) => setFormData({ ...formData, targetAge: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">교육 주제</Label>
            <Input
              id="theme"
              placeholder="예: 영어 교육, IT/코딩, 보건 교육 등"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              프로젝트 만들기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
