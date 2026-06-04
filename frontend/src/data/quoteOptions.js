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

// 이사 종류 — 개인(가정) 그룹 + 기업·관공서 그룹
export const TYPES = [
  // 가정 이사
  { slug: 'single', label: '이삿날 싱글', icon: '🧳', desc: '원룸·소형 단신 이사를 빠르고 합리적으로', group: '가정 이사' },
  { slug: 'packing', label: '포장이사', icon: '📦', desc: '짐 싸기부터 운반·정리까지 한 번에', group: '가정 이사' },
  { slug: 'semi', label: '반포장이사', icon: '🪑', desc: '깨지기 쉬운 짐만 포장하는 실속형', group: '가정 이사' },
  { slug: 'general', label: '일반이사', icon: '🚚', desc: '운반 중심의 가성비 이사', group: '가정 이사' },
  // 기업·관공서 이사
  { slug: 'office', label: '사무실이사', icon: '🏢', desc: '집기·OA기기·서버까지 업무 공백 없이 이전', group: '기업·관공서 이사' },
  { slug: 'warehouse', label: '창고이사', icon: '📦', desc: '재고·자재 대량 보관물의 안전한 입출고 이전', group: '기업·관공서 이사' },
  { slug: 'gov', label: '관공서이사', icon: '🏛️', desc: '문서·비품 보안 관리와 입찰·계약 절차 지원', group: '기업·관공서 이사' },
  { slug: 'hospital', label: '병원이사', icon: '🏥', desc: '의료 장비·기록물의 위생·정밀 이전', group: '기업·관공서 이사' },
  { slug: 'factory', label: '공장이사', icon: '🏭', desc: '대형 설비·재고 대량 운반과 라인 재배치', group: '기업·관공서 이사' },
  { slug: 'lab', label: '실험실이사', icon: '🧪', desc: '정밀 기기·시약의 충격·온도 관리 이전', group: '기업·관공서 이사' },
  { slug: 'gallery', label: '전시장이사', icon: '🖼️', desc: '전시물·디스플레이의 파손 없는 세심한 운반', group: '기업·관공서 이사' },
]

// 그룹 순서(렌더용)와 그룹별 종류
export const TYPE_GROUPS = ['가정 이사', '기업·관공서 이사']
export const homeTypes = TYPES.filter((t) => t.group === '가정 이사')
export const businessTypes = TYPES.filter((t) => t.group === '기업·관공서 이사')

export const findMethod = (slug) => METHODS.find((m) => m.slug === slug)
export const findType = (slug) => TYPES.find((t) => t.slug === slug)
