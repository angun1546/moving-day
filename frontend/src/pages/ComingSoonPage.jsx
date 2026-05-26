import { Link } from 'react-router-dom'

// 로그인/회원가입 등 준비 중인 기능 안내용 페이지
function ComingSoonPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="text-6xl">🚧</div>
      <h1 className="mt-6 text-3xl font-bold text-gray-900">준비 중인 기능이에요</h1>
      <p className="mt-4 leading-relaxed text-gray-600">
        로그인 / 회원가입 기능은 곧 제공될 예정입니다.
        <br />
        지금은 회원가입 없이도 견적을 신청하실 수 있어요.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/quote"
          className="rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          견적 신청하기
        </Link>
        <Link
          to="/"
          className="rounded-full border border-gray-300 bg-white px-7 py-3 font-semibold text-gray-700 transition hover:border-brand hover:text-brand"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  )
}

export default ComingSoonPage
