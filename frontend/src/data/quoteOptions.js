// 견적 방식 (큰 틀 3가지)
export const METHODS = [
  {
    slug: 'visit',
    label: '방문견적',
    title: '방문 견적',
    icon: '🏠',
    desc: '전문가가 직접 방문해 짐을 보고 가장 정확하게 산정해 드려요.',
  },
  {
    slug: 'photo',
    label: '사진견적',
    title: '비대면 사진 견적',
    icon: '📷',
    desc: '사진만 올리면 끝. 방문 없이 빠르게 견적을 받아보세요.',
    badge: '추가금 없음',
  },
  {
    slug: 'call',
    label: '전화상담',
    title: '실시간 전화상담 견적',
    icon: '📞',
    desc: '상담원과 전화로 바로 상담하고 견적을 확인하세요.',
  },
]

// 이사 종류
export const TYPES = [
  { slug: 'packing', label: '포장이사', icon: '📦', desc: '짐 싸기부터 운반·정리까지 한 번에' },
  { slug: 'semi', label: '반포장이사', icon: '🪑', desc: '깨지기 쉬운 짐만 포장하는 실속형' },
  { slug: 'general', label: '일반이사', icon: '🚚', desc: '운반 중심의 가성비 이사' },
  { slug: 'office', label: '사무실이사', icon: '🏢', desc: '업무 공백 없이 빠르고 정확하게' },
  { slug: 'business', label: '기업·관공서 이사', icon: '🏛️', desc: '대량·무중단 이전, 세금계산서 발행' },
]

export const findMethod = (slug) => METHODS.find((m) => m.slug === slug)
export const findType = (slug) => TYPES.find((t) => t.slug === slug)
