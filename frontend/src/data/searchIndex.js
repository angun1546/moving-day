// 사이트 내 검색 인덱스 — 검색어로 연관 페이지를 찾아 이동
// 고객(USER)과 파트너(PARTNER) 각각의 주요 페이지 메타를 둔다

export const USER_PAGES = [
  {
    title: '이사 견적 신청',
    desc: '포장·반포장·일반·사무실 이사 견적을 무료로 신청하세요.',
    path: '/quote',
    icon: '📦',
    keywords: ['견적', '신청', '이사', '포장이사', '반포장', '일반이사', '사무실이사', '무료견적'],
  },
  {
    title: '받은 견적 비교',
    desc: '업체들이 보낸 입찰 견적을 한눈에 비교하고 선택하세요.',
    path: '/quote/bids',
    icon: '⚖️',
    keywords: ['비교', '입찰', '업체', '선택', '견적비교'],
  },
  {
    title: '고객 후기',
    desc: '실제 이용 고객들의 솔직한 이사 후기를 확인하세요.',
    path: '/reviews',
    icon: '⭐',
    keywords: ['후기', '리뷰', '평점', '평가', '만족도'],
  },
  {
    title: '자주 묻는 질문',
    desc: '이용 방법이 궁금하면 FAQ에서 빠르게 찾아보세요.',
    path: '/faq',
    icon: '❓',
    keywords: ['faq', '질문', '문의', '도움말', '자주묻는'],
  },
  {
    title: '공지사항',
    desc: '서비스 소식과 업데이트, 이벤트를 확인하세요.',
    path: '/notice',
    icon: '📢',
    keywords: ['공지', '소식', '안내', '업데이트', '이벤트'],
  },
  {
    title: '마이페이지',
    desc: '내 견적 신청 내역과 진행 상태를 확인하세요.',
    path: '/mypage',
    icon: '🙋',
    keywords: ['마이페이지', '내정보', '신청내역', '내견적', '진행상태'],
  },
  {
    title: '로그인 / 회원가입',
    desc: '로그인하고 견적 신청 내역을 관리하세요.',
    path: '/login',
    icon: '🔑',
    keywords: ['로그인', '회원가입', '가입', '계정'],
  },
]

export const PARTNER_PAGES = [
  {
    title: '파트너 홈',
    desc: '무브 마스터 파트너 센터 메인으로 이동합니다.',
    path: '/partner',
    icon: '🏠',
    keywords: ['파트너', '홈', '메인'],
  },
  {
    title: '입찰 대시보드',
    desc: '들어온 견적 요청을 확인하고 입찰하세요.',
    path: '/partner/dashboard',
    icon: '🎯',
    keywords: ['대시보드', '입찰', '견적요청', '일감', '요청'],
  },
  {
    title: '업체 정보 등록',
    desc: '서비스 지역과 강점을 등록해 매칭률을 높이세요.',
    path: '/partner/profile',
    icon: '🏢',
    keywords: ['업체정보', '프로필', '등록', '지역', '소개', '강점'],
  },
  {
    title: '파트너 스토리',
    desc: '먼저 시작한 파트너들의 후기와 내 후기 작성.',
    path: '/partner/story',
    icon: '✍️',
    keywords: ['스토리', '후기', '사례', '리뷰'],
  },
  {
    title: '파트너 FAQ',
    desc: '가입·수수료·입찰 관련 자주 묻는 질문.',
    path: '/partner/faq',
    icon: '❓',
    keywords: ['faq', '질문', '수수료', '가입', '문의'],
  },
  {
    title: '파트너 마이페이지',
    desc: '내 입찰 내역과 매칭 현황을 확인하세요.',
    path: '/partner/mypage',
    icon: '🙋',
    keywords: ['마이페이지', '내정보', '입찰내역', '매칭'],
  },
  {
    title: '공지사항',
    desc: '파트너 대상 소식과 안내를 확인하세요.',
    path: '/partner/notice',
    icon: '📢',
    keywords: ['공지', '소식', '안내'],
  },
]

// Hero 검색창 아래 추천 검색어 칩
export const USER_SUGGESTIONS = ['포장이사', '견적 비교', '후기', '공지사항']
export const PARTNER_SUGGESTIONS = ['입찰', '업체 정보', '수수료', '파트너 스토리']

// 검색어로 페이지 필터링 (제목·설명·키워드 대상, 공백으로 나눈 모든 단어 포함)
export function searchPages(pages, query) {
  const q = (query ?? '').trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/)
  return pages.filter((p) => {
    const hay = `${p.title} ${p.desc} ${p.keywords.join(' ')}`.toLowerCase()
    return terms.every((t) => hay.includes(t))
  })
}
