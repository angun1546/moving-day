// 불편사항 접수 API 클라이언트 — 제출은 공개, 목록·처리·삭제는 관리자
import type { Complaint } from '../data/apiTypes'
import { authHeaders } from './auth'

const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/complaints`

// 목록 (관리자)
export async function getComplaints(): Promise<Complaint[]> {
  const res = await fetch(API, { headers: authHeaders() })
  if (!res.ok) throw new Error('불편사항 조회에 실패했습니다.')
  return res.json()
}

// 접수 (공개)
export async function createComplaint(
  data: Partial<Complaint>,
): Promise<Complaint> {
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

// 처리 (관리자 — 상태·답변)
export async function updateComplaint(
  id: string,
  data: Partial<Complaint>,
): Promise<Complaint> {
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('처리에 실패했습니다.')
  return res.json()
}

// 삭제 (관리자)
export async function deleteComplaint(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('삭제에 실패했습니다.')
  return res.json()
}
