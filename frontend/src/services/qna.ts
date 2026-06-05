// Q&A 문의 API 클라이언트 (scope: user | partner)
import type { Qna } from '../data/apiTypes'

const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/qna`

// scope별 목록 (최신순)
export async function getQna(scope: string): Promise<Qna[]> {
  const res = await fetch(`${API}/${scope}`)
  if (!res.ok) throw new Error('Q&A 조회에 실패했습니다.')
  return res.json()
}

// 질문 작성
export async function createQna(data: Partial<Qna>): Promise<Qna> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? '질문 등록에 실패했습니다.')
  }
  return res.json()
}

// 수정 (관리자 답변 a, 숨김 hidden)
export async function updateQna(id: string, data: Partial<Qna>): Promise<Qna> {
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Q&A 수정에 실패했습니다.')
  return res.json()
}

// 질문 삭제
export async function deleteQna(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Q&A 삭제에 실패했습니다.')
  return res.json()
}
