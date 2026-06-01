import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 파트너 전용 라우트 가드 (엄격 분리)
//  - 비로그인: 파트너 로그인으로
//  - 고객 계정: 파트너 랜딩으로 (파트너 가입 유도)
//  - partner/admin: 통과
function RequirePartner({ children }) {
  const { user, isPartner, isAdmin, ready } = useAuth()
  if (!ready) return null // 토큰 복원 중 깜빡임 방지
  if (!user) return <Navigate to="/login?role=partner" replace />
  if (!isPartner && !isAdmin) return <Navigate to="/partner" replace />
  return children
}

export default RequirePartner
