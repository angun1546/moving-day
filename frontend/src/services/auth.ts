import type { User, AuthResult } from '../data/apiTypes'

// 배포 환경에서는 VITE_API_BASE로 백엔드 절대 URL 주입 (예: https://moving-day-api.onrender.com)
// 로컬은 비워두면 vite proxy(/api → :4000)가 그대로 처리한다.
const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/auth`
const TOKEN_KEY = 'movingday_token'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY)
const setToken = (t: string): void => localStorage.setItem(TOKEN_KEY, t)

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
