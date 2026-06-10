import nodemailer from 'nodemailer'

// Gmail SMTP 메일 발송 — 키(GMAIL_USER·GMAIL_APP_PASSWORD)가 있으면 실제 발송,
// 없으면 mock(콘솔 로그) → 가입·키 설정 전 개발 테스트 가능
const USER = process.env.GMAIL_USER
const PASS = process.env.GMAIL_APP_PASSWORD
const live = Boolean(USER && PASS)

// 메일 실발송 가능 여부 — 이메일 인증 mock 처리 판단용
export const isMailLive = (): boolean => live

const transporter = live
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: USER, pass: PASS },
    })
  : null

// 메일 발송 — 실패가 본 흐름(가입 등)을 막지 않도록 오류는 삼킨다
export async function sendMail(
  to: string,
  subject: string,
  text: string,
): Promise<void> {
  if (!live || !transporter) {
    console.log(`[메일 mock] → ${to} : ${subject} / ${text.replace(/\n/g, ' ')}`)
    return
  }
  try {
    await transporter.sendMail({ from: `이삿날 <${USER}>`, to, subject, text })
    console.log(`[메일 발송] → ${to}`)
  } catch (err) {
    console.error('[메일 발송 오류]', err)
  }
}
