// 파트너 스토리 API 클라이언트
import type { PartnerStory } from '../data/apiTypes'
import { authHeaders } from './auth'

const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/stories`

// 목록 (최신순 — 숨김 포함, 화면별로 프론트가 필터)
export async function getStories(): Promise<PartnerStory[]> {
  const res = await fetch(API)
  if (!res.ok) throw new Error('파트너 스토리 조회에 실패했습니다.')
  return res.json()
}

// 작성
export async function createStory(
  data: Partial<PartnerStory>,
): Promise<PartnerStory> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? '후기 등록에 실패했습니다.')
  }
  return res.json()
}

// 수정 (관리자 수정·숨김·답변)
export async function updateStory(
  id: string,
  data: Partial<PartnerStory>,
): Promise<PartnerStory> {
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('파트너 스토리 수정에 실패했습니다.')
  return res.json()
}

// 삭제
export async function deleteStory(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('파트너 스토리 삭제에 실패했습니다.')
  return res.json()
}
