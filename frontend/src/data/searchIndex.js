// 사이트 내 검색 인덱스 — 검색어로 연관 페이지를 찾아 이동
// 고객(USER)과 파트너(PARTNER) 각각의 주요 페이지 메타를 둔다

export const USER_PAGES = [
  {
    title: '이사 견적 신청',
    desc: '가정이사부터 기업·관공서 이사까지 견적을 무료로 신청하세요.',
    path: '/quote',
    icon: '📦',
    keywords: ['견적', '신청', '이사', '포장이사', '반포장이사', '일반이사', '무료견적', '비교견적'],
  },
  {
    title: '가정이사',
    desc: '원룸부터 대형 평수까지, 집 이사 견적을 무료로 비교하세요.',
    path: '/home',
    icon: '🏠',
    keywords: ['가정이사', '집이사', '원룸', '원룸이사', '이삿날싱글', '싱글', '단신', '포장이사', '반포장이사', '일반이사', '이사'],
  },
  {
    title: '기업·관공서 이사',
    desc: '사무실·창고·관공서·병원·공장·실험실·전시장 등 법인 이사 전문.',
    path: '/business',
    icon: '🏛️',
    keywords: [
      '기업이사',
      '관공서이사',
      '법인',
      '사무실이사',
      '창고이사',
      '병원이사',
      '공장이사',
      '실험실이사',
      '전시장이사',
      '세금계산서',
      '오피스',
    ],
  },
  {
    title: '받은 견적 비교',
    desc: '업체들이 보낸 입찰 견적을 한눈에 비교하고 선택하세요.',
    path: '/quote/bids',
    icon: '⚖️',
    keywords: ['비교', '입찰', '업체', '선택', '견적비교'],
  },
  {
    title: '청소',
    desc: '입주(웰컴케어)·사무실(워크스페이스 케어)·의자(오브제 딥클린) 청소 상품.',
    path: '/cleaning',
    icon: '🧹',
    keywords: ['청소', '입주청소', '사무실청소', '의자세척', '딥클린'],
  },
  {
    title: '웰컴케어 (입주 청소)',
    desc: '새 집 입주 전 구석구석 청소로 첫날부터 쾌적하게.',
    path: '/cleaning/welcome',
    icon: '🏠',
    keywords: ['웰컴케어', '입주청소', '입주', '새집청소', '청소'],
  },
  {
    title: '워크스페이스 케어 (사무실 청소)',
    desc: '사무실·매장을 전문 인력이 한 번에 구석구석 청소.',
    path: '/cleaning/workspace',
    icon: '🏢',
    keywords: ['워크스페이스케어', '사무실청소', '오피스청소', '청소'],
  },
  {
    title: '오브제 딥클린 (의자 세척)',
    desc: '의자·패브릭을 전문 장비로 깊숙이 세척하는 딥클린.',
    path: '/cleaning/objet',
    icon: '🪑',
    keywords: ['오브제딥클린', '의자세척', '의자청소', '패브릭', '딥클린', '청소'],
  },
  {
    title: '창고보관',
    desc: '컨테이너·창고·모듈형·무빙박스 등 짐 보관 상품.',
    path: '/storage',
    icon: '📦',
    keywords: ['창고보관', '보관', '짐보관', '컨테이너보관', '모듈형보관', '무빙박스'],
  },
  {
    title: '컨테이너 보관',
    desc: '컨테이너 단위로 짐을 통째로 안전하게 보관.',
    path: '/storage/container',
    icon: '🚛',
    keywords: ['컨테이너보관', '컨테이너', '보관', '창고보관'],
  },
  {
    title: '모듈형 보관',
    desc: '랙(선반)에 물건별로 적재해 쉽게 찾는 보관.',
    path: '/storage/modular',
    icon: '🗄️',
    keywords: ['모듈형보관', '랙보관', '랙', '선반', '물건별', '보관', '창고보관'],
  },
  {
    title: '무빙박스',
    desc: '이동식 컨테이너를 문 앞에 배송해 담은 그대로 보관·운송.',
    path: '/storage/movingbox',
    icon: '🛻',
    keywords: ['무빙박스', '이동식컨테이너', '이동식', '컨테이너', '보관', '운송'],
  },
  {
    title: '문서보관·파쇄',
    desc: '보안 문서·디지털 매체 파쇄부터 장기 보관, 스마트 인덱싱까지.',
    path: '/document',
    icon: '🗂️',
    keywords: ['문서보관', '문서파쇄', '파쇄', '보안', '아카이브', '인덱싱', '폐기'],
  },
  {
    title: '보안 문서 파쇄',
    desc: '기밀 문서를 보안 절차에 따라 안전하게 파쇄.',
    path: '/document/shred',
    icon: '📄',
    keywords: ['보안문서파쇄', '문서파쇄', '기밀', '파쇄', '문서보관'],
  },
  {
    title: '디지털 미디어 파쇄',
    desc: '하드디스크·USB 등 저장매체를 물리적으로 파기.',
    path: '/document/media',
    icon: '💽',
    keywords: ['디지털미디어파쇄', '하드디스크파기', '저장매체', '데이터파기', '파쇄'],
  },
  {
    title: '코어 천공 폐기',
    desc: '저장매체 코어를 천공해 물리적으로 무력화.',
    path: '/document/core',
    icon: '🕳️',
    keywords: ['코어천공', '천공폐기', '하드천공', '저장매체', '폐기'],
  },
  {
    title: '아카이브 스토리지',
    desc: '보존이 필요한 문서를 안전한 환경에 장기 보관.',
    path: '/document/archive',
    icon: '🗃️',
    keywords: ['아카이브', '아카이브스토리지', '문서보관', '장기보관', '보존'],
  },
  {
    title: '스마트 인덱싱',
    desc: '문서를 분류·색인화해 빠르게 찾도록 관리.',
    path: '/document/indexing',
    icon: '🏷️',
    keywords: ['스마트인덱싱', '인덱싱', '색인', '문서분류', '문서검색', '문서보관'],
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
    title: '기업소개',
    desc: '기업소개 페이지.',
    path: '/about',
    icon: '🏢',
    keywords: ['기업소개', '회사소개', '소개'],
  },
  {
    title: '기업문화',
    desc: '기업문화 페이지.',
    path: '/culture',
    icon: '🌱',
    keywords: ['기업문화', '문화'],
  },
  {
    title: '인증현황',
    desc: '인증현황 페이지.',
    path: '/certifications',
    icon: '✅',
    keywords: ['인증현황', '인증'],
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
export const USER_SUGGESTIONS = ['가정이사', '기업·관공서 이사', '포장이사', '후기']
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
