import { redirect } from 'react-router-dom'

const API = '/api/quotes'

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

  return redirect('/quote/done')
}
