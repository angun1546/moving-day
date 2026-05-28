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
