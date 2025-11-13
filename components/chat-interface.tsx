"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, Sparkles } from "lucide-react"
import { useEffect, useRef } from "react"
import { saveProjects, loadProjects } from "@/lib/storage"

interface ChatInterfaceProps {
  project: Project
  onUpdateProject: (project: Project) => void
}

export function ChatInterface({ project, onUpdateProject }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    initialMessages: project.chatHistory.map((msg) => ({
      id: msg.id,
      role: msg.role,
      parts: [{ type: "text" as const, text: msg.content }],
    })),
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const chatHistory = messages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.parts.map((part) => (part.type === "text" ? part.text : "")).join(""),
      timestamp: new Date().toISOString(),
    }))

    const updated = {
      ...project,
      chatHistory,
      updatedAt: new Date().toISOString(),
    }

    const projects = loadProjects()
    const updatedProjects = projects.map((p) => (p.id === project.id ? updated : p))
    saveProjects(updatedProjects)
    onUpdateProject(updated)
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const textarea = textareaRef.current
    if (!textarea || !textarea.value.trim()) return

    sendMessage({ text: textarea.value })
    textarea.value = ""
    textarea.style.height = "auto"
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const startingPrompts = [
    `${project.country}에서 ${project.targetAge} 대상으로 ${project.theme} 프로그램을 진행하려고 합니다. 어떤 것부터 시작하면 좋을까요?`,
    `${project.targetAge}에게 적합한 ${project.theme} 활동 아이디어를 추천해주세요.`,
    `${project.country}의 문화적 특성과 주의사항을 알려주세요.`,
    `프로그램 일정을 어떻게 구성하면 좋을까요?`,
  ]

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <Card className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
            <p className="text-sm text-gray-700">
              {project.country} · {project.targetAge} · {project.theme}
            </p>
          </div>
        </div>
      </Card>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI 어시스턴트와 대화를 시작하세요</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                프로그램 기획에 대해 무엇이든 물어보세요. 아래 질문으로 시작할 수도 있습니다.
              </p>
              <div className="grid gap-2 w-full max-w-2xl">
                {startingPrompts.map((prompt, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="text-left h-auto py-3 px-4 justify-start text-sm bg-transparent"
                    onClick={() => {
                      if (textareaRef.current) {
                        textareaRef.current.value = prompt
                        textareaRef.current.focus()
                      }
                    }}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.parts.map((part, i) => (part.type === "text" ? <span key={i}>{part.text}</span> : null))}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
              className="resize-none min-h-[60px] max-h-[200px]"
              onKeyDown={handleKeyDown}
              disabled={status === "in_progress"}
              rows={2}
            />
            <Button
              type="submit"
              size="icon"
              className="h-[60px] w-[60px] flex-shrink-0"
              disabled={status === "in_progress"}
            >
              {status === "in_progress" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
