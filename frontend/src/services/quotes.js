import { redirect } from 'react-router-dom'

const API = '/api/quotes'

// 견적 신청 폼 제출 (React Router action)
export async function createQuote({ request }) {
  const form = await request.formData()
  const data = Object.fromEntries(form)

  // 선택 항목이 비어 있으면 전송하지 않는다
  for (const key of ['moveDate', 'homeSize', 'memo']) {
    if (!data[key]) delete data[key]
  }

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { error: err.message ?? '신청에 실패했습니다. 잠시 후 다시 시도해 주세요.' }
  }

  return redirect('/quote/done')
}
