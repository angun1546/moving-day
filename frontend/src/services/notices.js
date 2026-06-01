// 공지사항 API 클라이언트
const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/notices`

// 공지 목록 (최신순)
export async function getNotices() {
  const res = await fetch(API)
  if (!res.ok) throw new Error('공지 조회에 실패했습니다.')
  return res.json()
}

// 공지 작성
export async function createNotice(data) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? '공지 등록에 실패했습니다.')
  }
  return res.json()
}

// 공지 수정
export async function updateNotice(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('공지 수정에 실패했습니다.')
  return res.json()
}

// 공지 삭제
export async function deleteNotice(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('공지 삭제에 실패했습니다.')
  return res.json()
}
