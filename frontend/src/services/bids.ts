// 입찰 API 클라이언트
import type { Bid } from '../data/apiTypes'

const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/bids`

// 입찰 생성 (파트너)
export async function createBid(data: Partial<Bid>): Promise<Bid> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? '입찰에 실패했습니다.')
  }
  return res.json()
}

// 견적별 입찰 목록 (고객 비교 — 가격 오름차순)
export async function getBidsByQuote(quoteId: string): Promise<Bid[]> {
  const res = await fetch(`${API}/quote/${quoteId}`)
  if (!res.ok) throw new Error('입찰 조회에 실패했습니다.')
  return res.json()
}

// 파트너 본인 입찰 목록
export async function getMyBids(email: string): Promise<Bid[]> {
  const res = await fetch(`${API}/mine/${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error('입찰 조회에 실패했습니다.')
  return res.json()
}

// 낙찰 처리 (고객이 입찰 선택)
export async function acceptBid(bidId: string): Promise<Bid> {
  const res = await fetch(`${API}/${bidId}/accept`, { method: 'PATCH' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? '낙찰 처리에 실패했습니다.')
  }
  return res.json()
}

// 낙찰 취소 (계약 전까지)
export async function cancelBid(bidId: string): Promise<Bid> {
  const res = await fetch(`${API}/${bidId}/cancel`, { method: 'PATCH' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? '낙찰 취소에 실패했습니다.')
  }
  return res.json()
}
