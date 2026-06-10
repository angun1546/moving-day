import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MyQuotesBox from '../components/MyQuotesBox'

// 내 견적 현황 페이지 — 마이페이지 활동 카드 "견적 신청"에서 진입
function MyQuotesPage() {
  const { user, ready } = useAuth()

  if (!ready) return null // 로그인 상태 복원 전 깜빡임 방지
  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-gray-600">로그인이 필요한 페이지입니다.</p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          로그인
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <Link
        to="/mypage"
        className="text-sm text-gray-500 transition hover:text-brand"
      >
        ← 마이페이지
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">내 견적 현황</h1>
      <p className="mt-2 text-gray-600">
        신청한 견적의 입찰·낙찰·진행 상태를 한눈에 확인하세요.
      </p>
      <div className="mt-8">
        <MyQuotesBox email={user.username} />
      </div>
    </section>
  )
}

export default MyQuotesPage
