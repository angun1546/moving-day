import type { ServiceProduct } from './types'

// 문서보관·파쇄 서비스 — 상품 소개 단일 출처 (GNB·랜딩·상세·검색에서 재사용)
export const documentServices: ServiceProduct[] = [
  {
    slug: 'shred',
    label: '보안 문서 파쇄',
    icon: '📄',
    desc: '기밀 문서를 보안 절차에 따라 안전하게 파쇄해요.',
    tagline: '기밀은 흔적 없이, 안전하게',
    intro:
      '계약서·인사·회계 등 기밀 문서를 보안 절차에 따라 완전히 파쇄해요. 수거부터 파쇄까지 추적 관리하고, 파쇄 증명서를 발급해 정보 유출 위험을 없앱니다.',
    points: [
      { icon: '🔒', title: '보안 수거', desc: '잠금 수거함으로 안전하게 문서를 회수해요.' },
      { icon: '✂️', title: '완전 파쇄', desc: '복원이 불가능한 수준으로 분쇄 처리해요.' },
      { icon: '📜', title: '파쇄 증명서', desc: '처리 내역과 증명서를 발급해 드려요.' },
      { icon: '♻️', title: '친환경 처리', desc: '파쇄물은 재활용으로 친환경 처리해요.' },
    ],
  },
  {
    slug: 'media',
    label: '디지털 미디어 파쇄',
    icon: '💽',
    desc: '하드디스크·USB 등 저장매체를 물리적으로 파기해요.',
    tagline: '데이터는 매체째 완전 파기',
    intro:
      'HDD·SSD·USB·CD 등 디지털 저장매체를 물리적으로 파기해 데이터를 완전히 삭제해요. 소프트웨어 삭제로 남는 흔적까지 매체 자체를 파괴해 복원을 원천 차단합니다.',
    points: [
      { icon: '💽', title: '저장매체 파기', desc: 'HDD·SSD·USB·CD 등 매체를 물리 파괴해요.' },
      { icon: '🚫', title: '복원 원천 차단', desc: '데이터 복원이 불가능하도록 파기해요.' },
      { icon: '📜', title: '파기 증명서', desc: '매체별 파기 내역과 증명서를 발급해요.' },
      { icon: '🔒', title: '보안 이송', desc: '수거부터 파기까지 보안 절차로 관리해요.' },
    ],
  },
  {
    slug: 'core',
    label: '코어 천공 폐기',
    icon: '🕳️',
    desc: '저장매체 코어를 천공해 물리적으로 무력화해요.',
    tagline: '구멍을 뚫어 확실하게 무력화',
    intro:
      '하드디스크 등 저장매체의 코어(플래터)를 전용 장비로 천공해 물리적으로 무력화해요. 대량 매체를 빠르고 확실하게 폐기할 때 적합한 방식입니다.',
    points: [
      { icon: '🕳️', title: '코어 천공', desc: '플래터를 관통 천공해 물리적으로 파괴해요.' },
      { icon: '⚡', title: '대량 신속 처리', desc: '많은 매체도 빠르게 처리할 수 있어요.' },
      { icon: '🚫', title: '복원 불가', desc: '천공으로 데이터 복원을 불가능하게 해요.' },
      { icon: '📜', title: '처리 증명', desc: '폐기 내역과 증명서를 제공해요.' },
    ],
  },
  {
    slug: 'archive',
    label: '아카이브 스토리지',
    icon: '🗃️',
    desc: '보존이 필요한 문서를 안전한 환경에 장기 보관해요.',
    tagline: '오래 지켜야 할 기록, 안전하게',
    intro:
      '법정 보존 문서나 중요한 기록물을 온·습도와 보안이 관리되는 전용 보관소에 장기 보관해요. 필요할 때 빠르게 열람·반출할 수 있도록 체계적으로 관리합니다.',
    points: [
      { icon: '🗃️', title: '장기 보존 보관', desc: '법정 보존 문서를 안전하게 장기 보관해요.' },
      { icon: '🌡️', title: '환경 관리', desc: '온·습도 관리로 문서 훼손을 막아요.' },
      { icon: '🛡️', title: '보안 관리', desc: '출입 통제·CCTV로 안전하게 지켜요.' },
      { icon: '📤', title: '열람·반출', desc: '필요할 때 빠르게 찾아 반출해 드려요.' },
    ],
  },
  {
    slug: 'indexing',
    label: '스마트 인덱싱',
    icon: '🏷️',
    desc: '문서를 분류·색인화해 빠르게 찾도록 관리해요.',
    tagline: '필요한 문서를 한 번에 검색',
    intro:
      '보관 문서를 항목별로 분류하고 색인(인덱스)을 부여해 디지털로 관리해요. 어떤 문서가 어디에 있는지 검색으로 바로 확인하고, 필요한 자료만 빠르게 꺼낼 수 있어요.',
    points: [
      { icon: '🏷️', title: '분류·색인화', desc: '문서를 항목별로 분류하고 색인을 부여해요.' },
      { icon: '🔍', title: '빠른 검색', desc: '검색으로 원하는 문서를 바로 찾아요.' },
      { icon: '🖥️', title: '디지털 목록', desc: '보관 현황을 디지털 목록으로 관리해요.' },
      { icon: '📤', title: '개별 반출', desc: '필요한 문서만 골라 빠르게 반출해요.' },
    ],
  },
]

export const findDocument = (slug: string): ServiceProduct | undefined =>
  documentServices.find((s) => s.slug === slug)
