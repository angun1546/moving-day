// 리뷰 API 클라이언트 (업체 평점 집계 포함)
const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/reviews`

// 리뷰 목록 (최신순 — 숨김 포함, 화면별로 프론트가 필터)
export async function getReviews() {
  const res = await fetch(API)
  if (!res.ok) throw new Error('리뷰 조회에 실패했습니다.')
  return res.json()
}

// 업체별 평점 집계 [{ company, avg, count }]
export async function getRatings() {
  try {
    const res = await fetch(`${API}/ratings`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

// 리뷰 작성 → 생성된 리뷰 반환
export async function createReview(data) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? '리뷰 등록에 실패했습니다.')
  }
  return res.json()
}

// 리뷰 수정 (관리자 수정·숨김 토글·답변) → 보낸 필드만 변경
export async function updateReview(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('리뷰 수정에 실패했습니다.')
  return res.json()
}

// 리뷰 삭제
export async function deleteReview(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('리뷰 삭제에 실패했습니다.')
  return res.json()
}
