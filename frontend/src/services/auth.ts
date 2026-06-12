import type { User, AuthResult } from '../data/apiTypes'

// 다른 도메인의 백엔드를 쓸 때만 VITE_API_BASE로 절대 URL 주입.
// 가비아 단일 서버(Nginx 프록시)·로컬(vite proxy)은 비워두면 /api → :4000으로 연결된다.
const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/auth`
const TOKEN_KEY = 'movingday_token'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY)
const setToken = (t: string): void => localStorage.setItem(TOKEN_KEY, t)

// 소셜 로그인 콜백에서 받은 토큰을 저장 (OAuthKakaoPage에서 사용)
export const saveToken = (t: string): void => setToken(t)

// 카카오 REST 키가 설정돼 있으면 카카오 로그인 사용 가능
const KAKAO_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY ?? ''
const KAKAO_REDIRECT = import.meta.env.VITE_KAKAO_REDIRECT_URI ?? ''
export const isKakaoEnabled = (): boolean => Boolean(KAKAO_KEY && KAKAO_REDIRECT)

// '카카오로 시작하기' 클릭 시 이동할 카카오 인가 URL
export function kakaoAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: KAKAO_KEY,
    redirect_uri: KAKAO_REDIRECT,
    response_type: 'code',
  })
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`
}

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

// 아이디 중복 확인 (회원가입 실시간) — true면 사용 가능
export async function checkUsername(username: string): Promise<boolean> {
  try {
    const res = await fetch(`${API}/check-username?username=${encodeURIComponent(username)}`)
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

// 아이디 찾기 ① 인증번호 발송 — devCode는 SMS 키 미설정(mock)일 때만
export async function findIdSendCode(
  name: string,
  phone: string,
): Promise<{ devCode?: string }> {
  return post('/find-id/send-code', { name, phone })
}

// 아이디 찾기 ② 인증번호 확인 — 통과 시 가입 아이디(username) 전체 반환
export async function findIdConfirm(
  name: string,
  phone: string,
  code: string,
): Promise<string> {
  const data = await post<{ username: string }>('/find-id/confirm', { name, phone, code })
  return data.username
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

export async function login(username: string, password: string): Promise<User> {
  const data = await post<AuthResult>('/login', { username, password })
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
