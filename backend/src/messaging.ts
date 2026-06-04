import crypto from 'node:crypto'

// 솔라피(Solapi) SMS/알림톡 발송 — 외부 SDK 없이 REST + HMAC 서명으로 호출
// 키·발신번호가 모두 설정돼 있으면 실제 발송, 아니면 mock(콘솔 로그만) → 가입·심사 전 로컬 테스트 가능
const API_KEY = process.env.SOLAPI_API_KEY
const API_SECRET = process.env.SOLAPI_API_SECRET
const SENDER = process.env.SOLAPI_SENDER // 사전 등록된 발신번호
const KAKAO_PF_ID = process.env.SOLAPI_KAKAO_PF_ID // 카카오 비즈니스 채널 ID(알림톡, 선택)

const live = Boolean(API_KEY && API_SECRET && SENDER)

export interface KakaoOpts {
  templateId: string // 사전 승인된 알림톡 템플릿 ID
  variables?: Record<string, string>
}

export interface SendOpts {
  to?: string | null
  text: string
  kakao?: KakaoOpts // 지정 시 알림톡 우선(실패하면 SMS로 대체)
}

// 하이픈·공백 제거, 너무 짧으면 무효 처리
function normalize(phone?: string | null): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 9 ? digits : null
}

// 솔라피 인증 헤더 (HMAC-SHA256)
function authHeader(): string {
  const date = new Date().toISOString()
  const salt = crypto.randomBytes(32).toString('hex')
  const signature = crypto
    .createHmac('sha256', API_SECRET as string)
    .update(date + salt)
    .digest('hex')
  return `HMAC-SHA256 apiKey=${API_KEY}, date=${date}, salt=${salt}, signature=${signature}`
}

// 단건 발송 — 발송 실패가 본 거래(견적·입찰)를 막지 않도록 오류는 삼킨다
export async function sendMessage({ to, text, kakao }: SendOpts): Promise<void> {
  const phone = normalize(to)
  if (!phone) return

  // mock 모드: 키 미설정 시 콘솔 로그만
  if (!live) {
    console.log(
      `[메시지 mock] ${kakao ? '알림톡' : 'SMS'} → ${phone} : ${text.replace(/\n/g, ' ')}`,
    )
    return
  }

  const message: Record<string, unknown> = { to: phone, from: SENDER, text }
  if (kakao && KAKAO_PF_ID) {
    message.kakaoOptions = {
      pfId: KAKAO_PF_ID,
      templateId: kakao.templateId,
      variables: kakao.variables ?? {},
      disableSms: false, // 알림톡 실패 시 SMS 자동 대체
    }
  }

  try {
    const res = await fetch('https://api.solapi.com/messages/v4/send', {
      method: 'POST',
      headers: {
        Authorization: authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) {
      console.error('[메시지 발송 실패]', res.status, await res.text())
    }
  } catch (err) {
    console.error('[메시지 발송 오류]', err)
  }
}

// 여러 수신자(업체 목록 등)에게 동일 메시지
export async function sendMessageToMany(
  tos: (string | null | undefined)[],
  text: string,
  kakao?: KakaoOpts,
): Promise<void> {
  await Promise.all(tos.map((to) => sendMessage({ to, text, kakao })))
}
