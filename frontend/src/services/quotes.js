import { redirect } from 'react-router-dom'
import { addNotification } from '../utils/notifications'

// 배포는 VITE_API_BASE로 백엔드 절대 URL 주입, 로컬은 빈 문자열 → vite proxy 사용
const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/quotes`

// 견적 신청 폼 제출 (React Router action)
export async function createQuote({ request }) {
  const form = await request.formData()

  // 선택 항목이 비어 있으면 전송하지 않는다
  for (const key of ['moveDate', 'homeSize', 'memo', 'visitDate', 'callTime']) {
    if (!form.get(key)) form.delete(key)
  }

  // 사진을 고르지 않았으면 빈 파일 항목 제거
  const photos = form.getAll('photos')
  if (photos.length === 1 && photos[0] instanceof File && photos[0].size === 0) {
    form.delete('photos')
  }

  // multipart 그대로 전송 (Content-Type은 브라우저가 boundary와 함께 자동 설정)
  const res = await fetch(API, { method: 'POST', body: form })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { error: err.message ?? '신청에 실패했습니다. 잠시 후 다시 시도해 주세요.' }
  }

  // 방금 신청한 견적 id 저장 → 입찰 비교 페이지에서 사용
  const quote = await res.json().catch(() => null)
  if (quote?.id) {
    try {
      localStorage.setItem('movingday_last_quote_id', quote.id)
    } catch {
      // 저장 실패 무시
    }
  }

  // 마이페이지 활동 내역 카운트 (목업: 클라이언트 단순 카운트)
  try {
    const cur = parseInt(
      localStorage.getItem('movingday_user_quote_count') || '0',
      10,
    )
    localStorage.setItem('movingday_user_quote_count', String(cur + 1))
  } catch {
    // 저장 실패 무시
  }

  // 알림 추가 — 클릭 시 입찰 비교 페이지로
  addNotification({
    type: 'quote',
    message: '견적 신청이 접수되었습니다. 곧 업체들의 입찰이 시작됩니다.',
    link: '/quote/bids',
  })

  return redirect('/quote/done')
}

// 견적 목록 (파트너 입찰용·관리자 모니터링 — 입찰 포함)
export async function getQuotes() {
  const res = await fetch(API)
  if (!res.ok) throw new Error('견적 조회에 실패했습니다.')
  return res.json()
}
