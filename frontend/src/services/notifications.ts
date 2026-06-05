// 알림 API 클라이언트 (서버 거래 이벤트 — 폴링 조회)
import type { Notification } from '../data/apiTypes'

const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/notifications`

// 내 알림 목록 (최신순)
export async function getNotifications(email: string): Promise<Notification[]> {
  if (!email) return []
  try {
    const res = await fetch(`${API}/${encodeURIComponent(email)}`)
    if (!res.ok) return []
    return res.json()
  } catch {
    // 네트워크 오류 시 조용히 빈 목록 (벨 아이콘이 깨지지 않도록)
    return []
  }
}

// 내 알림 모두 읽음 처리
export async function markAllRead(email: string): Promise<void> {
  if (!email) return
  try {
    await fetch(`${API}/${encodeURIComponent(email)}/read`, { method: 'PATCH' })
  } catch {
    // 무시
  }
}

// 내 알림 모두 비우기
export async function clearNotifications(email: string): Promise<void> {
  if (!email) return
  try {
    await fetch(`${API}/${encodeURIComponent(email)}`, { method: 'DELETE' })
  } catch {
    // 무시
  }
}
