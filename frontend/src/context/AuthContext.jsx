import { createContext, useContext, useEffect, useState } from 'react'
import * as auth from '../services/auth'

const AuthContext = createContext(null)

// 관리자 식별 이메일 (풀스택 단계에서 user.role === 'admin' 체크로 교체)
const ADMIN_EMAIL = 'admin@movingday.com'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // 앱 시작 시 저장된 토큰으로 로그인 상태 복원 (네트워크 실패도 안전)
  useEffect(() => {
    auth
      .fetchMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  // 로그인 계정 기반 관리자 판별 (목업: 특정 이메일이면 admin)
  const isAdmin = user?.email === ADMIN_EMAIL

  const value = {
    user,
    ready,
    isAdmin,
    login: async (email, password) => {
      const u = await auth.login(email, password)
      setUser(u)
      return u
    },
    signup: async (payload) => {
      const u = await auth.signup(payload)
      setUser(u)
      return u
    },
    // 회원정보 부분 갱신 (마이페이지에 즉시 반영)
    updateUser: (changes) =>
      setUser((u) => (u ? { ...u, ...changes } : u)),
    logout: () => {
      auth.clearToken()
      setUser(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
