import { createContext, useContext, useEffect, useState } from 'react'
import * as auth from '../services/auth'

const AuthContext = createContext(null)

// 관리자 식별 이메일 (풀스택 단계에서 user.role === 'admin' 체크로 교체)
const ADMIN_EMAIL = 'admin@movingday.com'
const HEADER_KEY = 'movingday_header_mode'
const DISPLAY_KEY = 'movingday_display_mode'

// 백엔드가 아직 모르는 필드(nickname 등)를 이메일별 localStorage 오버라이드로 영속화
// 풀스택에서 User 모델에 컬럼이 추가되면 이 함수들 제거하고 fetchMe 결과를 그대로 사용
const OVERRIDES_PREFIX = 'movingday_user_overrides_'

function getOverrides(email) {
  if (!email || typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(OVERRIDES_PREFIX + email)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveOverrides(email, changes) {
  if (!email || typeof window === 'undefined') return
  try {
    const cur = getOverrides(email)
    localStorage.setItem(
      OVERRIDES_PREFIX + email,
      JSON.stringify({ ...cur, ...changes }),
    )
  } catch {
    // 저장 실패 무시
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  // 헤더 표시 이름 모드 (닉네임/실명) — Context로 두어 변경 즉시 헤더 리렌더
  const [headerMode, setHeaderModeState] = useState(() => {
    if (typeof window === 'undefined') return 'nickname'
    return localStorage.getItem(HEADER_KEY) || 'nickname'
  })
  function setHeaderMode(mode) {
    const m = mode === 'real' ? 'real' : 'nickname'
    setHeaderModeState(m)
    localStorage.setItem(HEADER_KEY, m)
  }

  // 리뷰·FAQ 표시 방식(닉네임/실명 마스킹) — Context로 두어 작성 폼이 즉시 갱신
  const [displayMode, setDisplayModeState] = useState(() => {
    if (typeof window === 'undefined') return 'nickname'
    return localStorage.getItem(DISPLAY_KEY) || 'nickname'
  })
  function setDisplayMode(mode) {
    const m = mode === 'real' ? 'real' : 'nickname'
    setDisplayModeState(m)
    localStorage.setItem(DISPLAY_KEY, m)
  }

  // 앱 시작 시 저장된 토큰으로 로그인 상태 복원 + 클라이언트 오버라이드 병합
  useEffect(() => {
    auth
      .fetchMe()
      .then((u) => {
        if (u) setUser({ ...u, ...getOverrides(u.email) })
        else setUser(null)
      })
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  // 로그인 계정 기반 관리자 판별 (목업: 특정 이메일이면 admin)
  const isAdmin = user?.email === ADMIN_EMAIL

  const value = {
    user,
    ready,
    isAdmin,
    headerMode,
    setHeaderMode,
    displayMode,
    setDisplayMode,
    login: async (email, password) => {
      const u = await auth.login(email, password)
      const merged = u ? { ...u, ...getOverrides(u.email) } : u
      setUser(merged)
      return merged
    },
    signup: async (payload) => {
      const u = await auth.signup(payload)
      // 백엔드가 무시하는 필드(nickname)는 클라이언트 오버라이드로 영속화
      if (u && payload.nickname) {
        saveOverrides(u.email, { nickname: payload.nickname })
      }
      const merged = u ? { ...u, ...getOverrides(u.email) } : u
      setUser(merged)
      return merged
    },
    // 회원정보 부분 갱신 (마이페이지에 즉시 반영) + 오버라이드 영속화
    updateUser: (changes) =>
      setUser((u) => {
        if (!u) return u
        saveOverrides(u.email, changes)
        return { ...u, ...changes }
      }),
    logout: () => {
      auth.clearToken()
      setUser(null)
      // 오버라이드는 유지 — 같은 계정으로 다시 로그인하면 닉네임 등 자동 복원
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
