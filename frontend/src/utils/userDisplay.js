// 회원 표시명 유틸 — 닉네임 그대로 / 실명 일부 가림(예: 김민지 → 김O지)

const KEY = 'movingday_display_mode'

export function getDisplayMode() {
  if (typeof window === 'undefined') return 'nickname'
  return localStorage.getItem(KEY) || 'nickname'
}

export function setDisplayMode(mode) {
  if (mode === 'real') localStorage.setItem(KEY, 'real')
  else localStorage.setItem(KEY, 'nickname')
}

// 실명 마스킹
// - 1글자: 그대로
// - 2글자: 첫 글자만 노출 (예: 김O)
// - 3글자: 중간만 O (예: 김O영)
// - 4글자 이상: 첫·끝만 노출, 중간은 모두 O (예: 남OO준)
export function maskName(name) {
  if (!name) return ''
  const n = String(name).trim()
  const len = n.length
  if (len <= 1) return n
  if (len === 2) return n[0] + 'O'
  return n[0] + 'O'.repeat(len - 2) + n[len - 1]
}

// 회원 표시명 — displayMode 기반으로 닉네임 또는 마스킹된 실명 반환
export function getDisplayName(user, mode) {
  if (!user) return ''
  const m = mode || getDisplayMode()
  if (m === 'real') return maskName(user.name)
  return user.nickname || user.name
}

// 답변 텍스트 자동 마스킹 — 호칭(님/씨) 앞에 오는 한국 이름만 골라 마스킹
// 일반 단어("정말", "김치를" 등)는 호칭이 없어 자동으로 제외됨
const KOREAN_FAMILY_NAMES = [
  '김', '이', '박', '최', '정', '강', '조', '윤', '장', '임',
  '한', '오', '서', '신', '권', '황', '안', '송', '류', '전',
  '홍', '고', '문', '양', '손', '배', '백', '허', '남', '심',
  '노', '하', '곽', '성', '차', '주', '우', '구', '민', '유',
  '나', '진', '지', '엄', '채', '원', '천', '방', '공', '현',
  '함', '변', '염', '여', '추', '도', '소', '석', '선', '설',
]

const NAME_IN_TEXT_PATTERN = new RegExp(
  `(${KOREAN_FAMILY_NAMES.join('|')})[가-힣]{1,3}(?=님|씨)`,
  'g',
)

export function maskKoreanNamesInText(text) {
  if (!text) return text
  return String(text).replace(NAME_IN_TEXT_PATTERN, (match) => maskName(match))
}
