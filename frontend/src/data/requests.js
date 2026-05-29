// 업체 입찰용 목업 데이터 (들어온 고객 견적 요청)
const BASE_REQUESTS = [
  {
    id: 'r1',
    moveType: '포장이사',
    from: '서울 마포구 합정동',
    to: '경기 고양시 일산동구',
    homeSize: '24평 아파트',
    moveDate: '2026-06-15',
    bidCount: 3,
    lowestBid: 290000,
  },
  {
    id: 'r2',
    moveType: '사무실이사',
    from: '서울 강남구 역삼동',
    to: '서울 성동구 성수동',
    homeSize: '30평 사무실',
    moveDate: '2026-06-20',
    bidCount: 5,
    lowestBid: 540000,
  },
  {
    id: 'r3',
    moveType: '반포장이사',
    from: '인천 부평구 부평동',
    to: '인천 남동구 구월동',
    homeSize: '18평 빌라',
    moveDate: '2026-06-18',
    bidCount: 2,
    lowestBid: 180000,
  },
  {
    id: 'r4',
    moveType: '일반이사',
    from: '서울 관악구 신림동',
    to: '서울 동작구 사당동',
    homeSize: '원룸',
    moveDate: '2026-06-12',
    bidCount: 4,
    lowestBid: 95000,
  },
  {
    id: 'r5',
    moveType: '포장이사',
    from: '경기 성남시 분당구',
    to: '서울 송파구 잠실동',
    homeSize: '34평 아파트',
    moveDate: '2026-06-25',
    bidCount: 1,
    lowestBid: 380000,
  },
]

// ⚠️ 페이지네이션 테스트용 추가 더미 — 확인 후 EXTRA_REQUESTS와 합치기 제거
const EXTRA_REQUESTS = Array.from({ length: 9 }, (_, i) => ({
  id: `rx${i}`,
  moveType: ['포장이사', '반포장이사', '일반이사', '사무실이사'][i % 4],
  from: ['서울 마포구', '경기 수원시', '인천 연수구', '서울 노원구'][i % 4],
  to: ['경기 성남시', '서울 강서구', '인천 미추홀구', '서울 은평구'][i % 4],
  homeSize: ['원룸', '18평 빌라', '24평 아파트', '30평 사무실'][i % 4],
  moveDate: `2026-06-${String((i % 27) + 1).padStart(2, '0')}`,
  bidCount: i % 6,
  lowestBid: 100000 + i * 25000,
}))

export const REQUESTS = [...BASE_REQUESTS, ...EXTRA_REQUESTS]
