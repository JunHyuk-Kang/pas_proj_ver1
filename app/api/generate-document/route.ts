import { generateText } from "ai"

export async function POST(req: Request) {
  const { type, projectData, chatHistory } = await req.json()

  let prompt = ""

  switch (type) {
    case "proposal":
      prompt = `다음 정보를 바탕으로 해외교육봉사 기획서를 작성해주세요:

프로젝트 정보:
- 프로젝트명: ${projectData.name}
- 대상 국가: ${projectData.country}
- 대상 연령: ${projectData.targetAge}
- 교육 주제: ${projectData.theme}

대화 내역을 참고하여 다음 항목을 포함한 상세한 기획서를 작성해주세요:
1. 프로젝트 개요
2. 목표 및 기대효과
3. 대상 분석
4. 프로그램 구성 (일정별 상세 활동)
5. 필요 자원 및 예산
6. 안전 관리 계획
7. 평가 계획

대화 내역:
${chatHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")}

형식: 마크다운으로 작성`
      break

    case "checklist":
      prompt = `${projectData.country} ${projectData.targetAge} 대상 ${projectData.theme} 교육봉사를 위한 체크리스트를 작성해주세요.

다음 카테고리별로 구체적인 항목을 작성해주세요:
1. 출국 전 준비사항
2. 교육 자료 및 준비물
3. 안전 및 보건 관련
4. 문화적 고려사항
5. 현지 도착 후 확인사항

각 항목은 체크박스 형식으로 작성하고, 중요도와 함께 표시해주세요.
형식: 마크다운으로 작성`
      break

    case "curriculum":
      prompt = `${projectData.country} ${projectData.targetAge} 대상 ${projectData.theme} 주제의 교육 커리큘럼을 작성해주세요.

다음을 포함해주세요:
1. 전체 프로그램 일정 (일차별)
2. 각 세션별 학습 목표
3. 활동 내용 및 방법
4. 필요 자료 및 준비물
5. 평가 방법
6. 주의사항

실제 현장에서 바로 활용 가능한 구체적인 커리큘럼을 작성해주세요.
형식: 마크다운으로 작성`
      break

    case "safety-guide":
      prompt = `${projectData.country}에서 ${projectData.targetAge} 대상 교육봉사를 진행할 때의 안전 가이드를 작성해주세요.

다음을 포함해주세요:
1. 현지 안전 상황 및 주의사항
2. 건강 관련 (예방접종, 약품, 응급처치)
3. 문화적 금기사항
4. 비상 연락처 및 대응 절차
5. 자연재해 대비
6. 팀원 안전 관리 규칙

구체적이고 실용적인 가이드를 작성해주세요.
형식: 마크다운으로 작성`
      break
  }

  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt,
    maxOutputTokens: 3000,
    temperature: 0.7,
  })

  return Response.json({ content: text })
}
