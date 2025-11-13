export interface Project {
  id: string
  name: string
  country: string
  targetAge: string
  theme: string
  status: "planning" | "in-progress" | "completed"
  createdAt: string
  updatedAt: string
  teamMembers: TeamMember[]
  chatHistory: ChatMessage[]
  documents: ProjectDocument[]
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: "leader" | "member"
  avatar?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface ProjectDocument {
  id: string
  type: "proposal" | "checklist" | "curriculum" | "safety-guide"
  title: string
  content: string
  generatedAt: string
}

export interface CaseStudy {
  id: string
  title: string
  country: string
  year: number
  targetAge: string
  theme: string
  summary: string
  highlights: string[]
  lessons: string[]
}
