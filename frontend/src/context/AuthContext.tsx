import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import * as auth from '../services/auth'
import type { User } from '../data/apiTypes'

// Context 값 타입 — 소비처(.tsx)에서 user·role 판별·액션을 안전하게 사용
interface AuthValue {
  user: User | null
  ready: boolean
  isAdmin: boolean
  isPartner: boolean
  headerMode: string
  setHeaderMode: (mode: string) => void
  displayMode: string
  setDisplayMode: (mode: string) => void
  login: (email: string, password: string) => Promise<User | null>
  signup: (payload: Record<string, unknown>) => Promise<User | null>
  updateUser: (changes: Partial<User>) => void
  logout: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

const HEADER_KEY = 'movingday_header_mode'
const DISPLAY_KEY = 'movingday_display_mode'

// 백엔드가 아직 모르는 필드(nickname 등)를 이메일별 localStorage 오버라이드로 영속화
// 풀스택에서 User 모델에 컬럼이 추가되면 이 함수들 제거하고 fetchMe 결과를 그대로 사용
const OVERRIDES_PREFIX = 'movingday_user_overrides_'

function getOverrides(email?: string | null): Partial<User> {
  if (!email || typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(OVERRIDES_PREFIX + email)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveOverrides(email: string | null | undefined, changes: Partial<User>) {
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  // 헤더 표시 이름 모드 (닉네임/실명) — Context로 두어 변경 즉시 헤더 리렌더
  const [headerMode, setHeaderModeState] = useState(() => {
    if (typeof window === 'undefined') return 'nickname'
    return localStorage.getItem(HEADER_KEY) || 'nickname'
  })
  function setHeaderMode(mode: string) {
    const m = mode === 'real' ? 'real' : 'nickname'
    setHeaderModeState(m)
    localStorage.setItem(HEADER_KEY, m)
  }

  // 리뷰·FAQ 표시 방식(닉네임/실명 마스킹) — Context로 두어 작성 폼이 즉시 갱신
  const [displayMode, setDisplayModeState] = useState(() => {
    if (typeof window === 'undefined') return 'nickname'
    return localStorage.getItem(DISPLAY_KEY) || 'nickname'
  })
  function setDisplayMode(mode: string) {
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

  // 역할 기반 판별 (백엔드 User.role)
  const isAdmin = user?.role === 'admin'
  const isPartner = user?.role === 'partner'

  const value: AuthValue = {
    user,
    ready,
    isAdmin,
    isPartner,
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
        saveOverrides(u.email, { nickname: payload.nickname as string })
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

export function useAuth(): AuthValue {
  // AuthProvider가 앱 전체를 감싸므로 항상 값이 존재
  return useContext(AuthContext) as AuthValue
}
