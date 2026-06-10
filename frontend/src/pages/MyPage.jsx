import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ActivityCard from '../components/ActivityCard'
import { getReviews } from '../services/reviews'
import { getMyQuotes } from '../services/quotes'
import { getQna } from '../services/qna'
import { getMyComplaints } from '../services/complaints'

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function MyPage() {
  const { user, logout, ready } = useAuth()
  // 활동 카운트는 실제 데이터 기준 — 견적·리뷰는 서버, 질문은 본인 것만
  const [reviews, setReviews] = useState([])
  const [quoteCount, setQuoteCount] = useState(0)
  useEffect(() => {
    getReviews()
      .then((d) => setReviews(Array.isArray(d) ? d : []))
      .catch(() => setReviews([]))
  }, [])
  useEffect(() => {
    if (!user?.username) return
    getMyQuotes(user.username)
      .then((d) => setQuoteCount(Array.isArray(d) ? d.length : 0))
      .catch(() => setQuoteCount(0))
  }, [user?.username])
  const [questions, setQuestions] = useState([])
  useEffect(() => {
    getQna('user')
      .then((d) => setQuestions(Array.isArray(d) ? d : []))
      .catch(() => setQuestions([]))
  }, [])
  const [complaintCount, setComplaintCount] = useState(0)
  useEffect(() => {
    if (!user?.username) return
    getMyComplaints()
      .then((d) => setComplaintCount(Array.isArray(d) ? d.length : 0))
      .catch(() => setComplaintCount(0))
  }, [user?.username])

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
      <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        My Page
      </p>
      <h1 className="mt-1 text-3xl font-bold text-gray-900">
        {user.nickname || user.name}님, 환영합니다
      </h1>
      <p className="mt-2 text-gray-600">내 정보와 이용 현황을 확인하세요.</p>

      {/* 내 정보 */}
      <h2 className="mt-10 text-lg font-bold text-gray-900">내 정보</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Info label="아이디" value={user.username} />
        <Info label="이름" value={user.name} />
        <Info label="닉네임" value={user.nickname || '-'} />
        <Info label="이메일" value={user.email} />
        <Info label="전화번호" value={user.phone || '-'} />
      </div>

      {/* 활동 내역 — 클릭 시 해당 페이지로 이동 */}
      <h2 className="mt-10 text-lg font-bold text-gray-900">활동 내역</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ActivityCard to="/mypage/quotes" label="견적 신청" count={quoteCount} />
        <ActivityCard
          to="/reviews"
          label="작성 리뷰"
          count={reviews.filter((r) => r.authorEmail === user.username).length}
        />
        <ActivityCard
          to="/faq"
          label="내 질문"
          count={questions.filter((q) => q.authorEmail === user.username).length}
        />
        <ActivityCard to="/complaint" label="내 불편사항" count={complaintCount} />
      </div>

      {/* 액션 */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/account"
          className="rounded-full bg-brand px-7 py-3 text-center font-semibold text-white transition hover:bg-brand-dark"
        >
          회원정보 수정
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-gray-300 bg-white px-7 py-3 text-center font-semibold text-gray-700 transition hover:border-brand hover:text-brand"
        >
          로그아웃
        </button>
      </div>
    </section>
  )
}

export default MyPage
