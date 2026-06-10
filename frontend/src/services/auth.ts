import type { User, AuthResult } from '../data/apiTypes'

// 다른 도메인의 백엔드를 쓸 때만 VITE_API_BASE로 절대 URL 주입.
// 가비아 단일 서버(Nginx 프록시)·로컬(vite proxy)은 비워두면 /api → :4000으로 연결된다.
const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/auth`
const TOKEN_KEY = 'movingday_token'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY)
const setToken = (t: string): void => localStorage.setItem(TOKEN_KEY, t)

// 인증이 필요한 요청(관리자·본인) 헤더 — 토큰 없으면 빈 객체
export const authHeaders = (): Record<string, string> => {
  const t = getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? '요청에 실패했습니다.')
  return data as T
}

// 이메일 중복 확인 (회원가입 실시간) — true면 사용 가능
// 네트워크 실패 시 true(막지 않음) — 서버 signup의 409가 최종 방어선
export async function checkEmail(email: string): Promise<boolean> {
  try {
    const res = await fetch(`${API}/check-email?email=${encodeURIComponent(email)}`)
    if (!res.ok) return true
    const data = await res.json()
    return Boolean(data.available)
  } catch {
    return true
  }
}

// 휴대폰 인증번호 발송 (가입 전 본인인증)
// devCode: SMS 키 미설정(mock)일 때만 내려오는 개발용 인증번호
export async function sendPhoneCode(phone: string): Promise<{ devCode?: string }> {
  return post('/send-code', { phone })
}

// 휴대폰 인증번호 확인 — 실패 시 throw(메시지 표시용)
export async function verifyPhoneCode(phone: string, code: string): Promise<void> {
  await post('/verify-code', { phone, code })
}

// 이메일 인증번호 발송 (가입 전 본인인증) — devCode는 메일 키 미설정(mock)일 때만
export async function sendEmailCode(email: string): Promise<{ devCode?: string }> {
  return post('/send-email-code', { email })
}

// 이메일 인증번호 확인 — 실패 시 throw
export async function verifyEmailCode(email: string, code: string): Promise<void> {
  await post('/verify-email-code', { email, code })
}

// 아이디(이메일) 찾기 — 마스킹된 이메일 반환(예: an***@gmail.com)
export async function findEmail(name: string, phone: string): Promise<string> {
  const data = await post<{ email: string }>('/find-email', { name, phone })
  return data.email
}

// ── 비밀번호 재설정 — SMS/이메일 인증 방식 ──
export async function resetSendPhoneCode(phone: string): Promise<{ devCode?: string }> {
  return post('/reset/send-phone-code', { phone })
}
export async function resetVerifyPhoneCode(phone: string, code: string): Promise<void> {
  await post('/reset/verify-phone-code', { phone, code })
}
export async function resetSendEmailCode(email: string): Promise<{ devCode?: string }> {
  return post('/reset/send-email-code', { email })
}
export async function resetVerifyEmailCode(email: string, code: string): Promise<void> {
  await post('/reset/verify-email-code', { email, code })
}
export async function resetPasswordAuth(payload: {
  method: 'phone' | 'email'
  phone?: string
  email?: string
  newPassword: string
}): Promise<void> {
  await post('/reset/password', payload)
}

export async function signup(payload: unknown): Promise<User> {
  const data = await post<AuthResult>('/signup', payload)
  setToken(data.token)
  return data.user
}

export async function login(email: string, password: string): Promise<User> {
  const data = await post<AuthResult>('/login', { email, password })
  setToken(data.token)
  return data.user
}

// 저장된 토큰으로 로그인 상태 복원
export async function fetchMe(): Promise<User | null> {
  const token = getToken()
  if (!token) return null
  const res = await fetch(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    clearToken()
    return null
  }
  const data = await res.json()
  return data.user as User
}
