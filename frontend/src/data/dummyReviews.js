// ⚠️ 페이지네이션 테스트용 임시 더미 — 동작 확인 후 삭제하세요
//   제거 시: main.jsx의 seedDummyReviews() 호출 + 이 파일 삭제, 그리고
//   브라우저 localStorage에서 id >= 90000 더미를 비우거나 키를 초기화하세요.
const KEY = 'movingday_user_reviews'

// localStorage에 더미를 1회 주입 (기존 리뷰는 보존, 중복 시드 방지)
export function seedDummyReviews() {
  if (typeof window === 'undefined') return
  try {
    const cur = JSON.parse(localStorage.getItem(KEY) || '[]')
    if (cur.some((r) => r.id >= 90000)) return // 이미 시드됨
    localStorage.setItem(KEY, JSON.stringify([...cur, ...DUMMY_REVIEWS]))
  } catch {
    // 파싱 실패 시 무시
  }
}

export const DUMMY_REVIEWS = Array.from({ length: 13 }, (_, i) => ({
  id: 90000 + i,
  name: ['김민수', '이영희', '박철수', '최지은', '정해성'][i % 5],
  text: `친절하고 꼼꼼하게 이사해 주셨어요. 강력 추천합니다! (테스트 ${i + 1})`,
  rating: (i % 5) + 1,
  moveType: ['포장이사', '반포장이사', '일반이사', '사무실 이사'][i % 4],
  company: ['스마트이사', '한빛익스프레스', '믿음로지스'][i % 3],
  date: `2026-05-${String((i % 28) + 1).padStart(2, '0')}`,
  authorEmail: '',
}))
