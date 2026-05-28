import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 관리자 전용 라우트 가드 — 비로그인은 로그인 페이지로, 비관리자는 홈으로
function RequireAdmin({ children }) {
  const { user, isAdmin, ready } = useAuth()
  if (!ready) return null // 토큰 복원 중 깜빡임 방지
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default RequireAdmin
