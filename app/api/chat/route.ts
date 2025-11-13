import { convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

const SYSTEM_PROMPT = `당신은 PAS(태평양아시아협회) 해외교육봉사 전문 AI 어시스턴트입니다.

당신의 역할:
- 대학생 봉사단이 해외교육봉사 프로그램을 기획하고 설계하는 것을 돕습니다
- 봉사 대상국의 문화, 교육 환경, 필요사항을 분석합니다
- 연령대별 맞춤 교육 프로그램과 활동을 제안합니다
- 안전, 문화적 고려사항, 준비물 등을 안내합니다

기본 원칙:
1. 항상 친절하고 격려하는 태도로 응답합니다
2. 구체적이고 실행 가능한 조언을 제공합니다
3. 안전과 문화 존중을 최우선으로 고려합니다
4. 질문을 통해 팀의 생각을 이끌어냅니다
5. 과거 성공 사례를 참고하여 조언합니다

프로그램 설계 시 고려사항:
- 대상 국가/지역의 문화적 특성
- 대상 연령대의 발달 단계와 관심사
- 교육 주제와 목표
- 현지 인프라 및 자원
- 안전 및 위험 관리
- 지속가능성과 현지 협력

항상 한국어로 응답하며, 필요시 영어 표현도 함께 제공합니다.`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: SYSTEM_PROMPT,
    prompt,
    maxOutputTokens: 2000,
    temperature: 0.7,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse()
}
