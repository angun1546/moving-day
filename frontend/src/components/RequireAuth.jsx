import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 보호 라우트 — 비로그인 시 파트너 로그인 페이지로 리다이렉트
function RequireAuth({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return null // 토큰 복원 중에는 깜빡임 방지
  if (!user) return <Navigate to="/login?role=partner" replace />
  return children
}

export default RequireAuth
