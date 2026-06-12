// 상담 신청 API 클라이언트 — 제출은 공개, 목록·처리·삭제는 관리자
import type { Consult } from '../data/apiTypes'
import { authHeaders } from './auth'

const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/consults`

// 목록 (관리자)
export async function getConsults(): Promise<Consult[]> {
  const res = await fetch(API, { headers: authHeaders() })
  if (!res.ok) throw new Error('상담신청 조회에 실패했습니다.')
  return res.json()
}

// 내 신청 목록 (본인 — 토큰 기준)
export async function getMyConsults(): Promise<Consult[]> {
  const res = await fetch(`${API}/mine`, { headers: authHeaders() })
  if (!res.ok) throw new Error('내 상담신청 조회에 실패했습니다.')
  return res.json()
}

// 신청 (공개)
export async function createConsult(
  data: Partial<Consult>,
): Promise<Consult> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? '접수에 실패했습니다.')
  }
  return res.json()
}

// 처리 (관리자 — 상태·메모·숨김)
export async function updateConsult(
  id: string,
  data: Partial<Consult>,
): Promise<Consult> {
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('처리에 실패했습니다.')
  return res.json()
}

// 삭제 (관리자)
export async function deleteConsult(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('삭제에 실패했습니다.')
  return res.json()
}
