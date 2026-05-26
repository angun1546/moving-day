import { createContext, useContext, useEffect, useState } from 'react'
import * as auth from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // 앱 시작 시 저장된 토큰으로 로그인 상태 복원
  useEffect(() => {
    auth
      .fetchMe()
      .then(setUser)
      .finally(() => setReady(true))
  }, [])

  const value = {
    user,
    ready,
    login: async (email, password) => setUser(await auth.login(email, password)),
    signup: async (payload) => setUser(await auth.signup(payload)),
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
