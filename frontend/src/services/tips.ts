// 팁 게시판 API 클라이언트 — 조회는 공개, 작성·수정·삭제는 관리자
import type { Tip } from '../data/apiTypes'
import { authHeaders } from './auth'

const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/tips`

// 목록 (최신순)
export async function getTips(): Promise<Tip[]> {
  const res = await fetch(API)
  if (!res.ok) throw new Error('팁 조회에 실패했습니다.')
  return res.json()
}

// 작성 (관리자)
export async function createTip(data: Partial<Tip>): Promise<Tip> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? '등록에 실패했습니다.')
  }
  return res.json()
}

// 수정 (관리자)
export async function updateTip(id: string, data: Partial<Tip>): Promise<Tip> {
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('수정에 실패했습니다.')
  return res.json()
}

// 삭제 (관리자)
export async function deleteTip(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('삭제에 실패했습니다.')
  return res.json()
}
