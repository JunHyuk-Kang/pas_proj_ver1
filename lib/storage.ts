import type { Project, CaseStudy } from "./types"

const PROJECTS_KEY = "pas_volunteer_projects"
const CURRENT_PROJECT_KEY = "pas_current_project"

export function saveProjects(projects: Project[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
  }
}

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(PROJECTS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveCurrentProject(projectId: string | null): void {
  if (typeof window !== "undefined") {
    if (projectId) {
      localStorage.setItem(CURRENT_PROJECT_KEY, projectId)
    } else {
      localStorage.removeItem(CURRENT_PROJECT_KEY)
    }
  }
}

export function loadCurrentProjectId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(CURRENT_PROJECT_KEY)
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "1",
    title: "베트남 다낭 초등학교 영어 교육 프로그램",
    country: "베트남",
    year: 2023,
    targetAge: "초등학생 (8-12세)",
    theme: "영어 교육",
    summary: "베트남 다낭 지역 초등학교에서 영어 회화 및 문화 교류 프로그램을 진행했습니다.",
    highlights: [
      "게임 기반 영어 학습으로 참여도 95% 달성",
      "한국 문화 소개 (K-POP, 한글) 세션 인기",
      "현지 교사와 협력하여 지속가능한 커리큘럼 개발",
    ],
    lessons: [
      "언어 장벽: 시각 자료와 제스처 활용이 효과적",
      "문화적 차이: 사전 조사와 현지 조언이 중요",
      "날씨 대응: 실내/실외 활동 모두 준비 필요",
    ],
  },
  {
    id: "2",
    title: "캄보디아 시엠립 IT 교육 봉사",
    country: "캄보디아",
    year: 2023,
    targetAge: "중학생 (13-15세)",
    theme: "IT/코딩 교육",
    summary: "캄보디아 시엠립의 중학교에서 기초 컴퓨터 활용 및 코딩 교육을 실시했습니다.",
    highlights: [
      "Scratch를 활용한 블록 코딩 교육",
      "학생들이 직접 만든 게임 작품 전시회 개최",
      "컴퓨터 기초 활용 능력 향상 (설문조사 80% 개선)",
    ],
    lessons: [
      "인프라 제약: 오프라인 학습 자료 필수",
      "수준 차이: 단계별 난이도 구성 필요",
      "지속성: 현지 교사 교육이 핵심",
    ],
  },
  {
    id: "3",
    title: "필리핀 세부 보건 교육 프로그램",
    country: "필리핀",
    year: 2024,
    targetAge: "초등학생 (6-10세)",
    theme: "보건/위생 교육",
    summary: "필리핀 세부 지역 초등학교에서 기본 위생 및 건강 관리 교육을 진행했습니다.",
    highlights: ["손씻기, 양치질 등 기본 위생 습관 교육", "영양 교육 및 건강한 식습관 안내", "응급처치 기본 교육 실시"],
    lessons: [
      "실습 중심: 이론보다 직접 체험이 효과적",
      "물품 준비: 위생용품 충분한 수량 확보",
      "언어: 간단한 현지어 학습이 도움됨",
    ],
  },
  {
    id: "4",
    title: "몽골 울란바토르 예체능 교육",
    country: "몽골",
    year: 2024,
    targetAge: "초중등학생 (10-14세)",
    theme: "예술/체육",
    summary: "몽골 울란바토르의 학교에서 미술, 음악, 체육 활동을 통한 정서 교육을 실시했습니다.",
    highlights: [
      "전통 악기와 현대 음악 융합 수업",
      "한국 전통 놀이 소개 (윷놀이, 제기차기)",
      "공동 작품 제작을 통한 협동심 강화",
    ],
    lessons: ["날씨: 극한의 추위 대비 필수", "문화 교류: 상호 문화 존중이 중요", "준비물: 예술 재료 충분히 준비"],
  },
]
