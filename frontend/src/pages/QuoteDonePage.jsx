import { Link } from 'react-router-dom'

function QuoteDonePage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="text-6xl">✅</div>
      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        이사 견적 신청이 완료되었습니다
      </h1>
      <p className="mt-4 leading-relaxed text-gray-600">
        검증된 이사업체들이 곧 입찰을 시작합니다.
        <br />
        들어온 입찰을 비교하고 가장 좋은 조건을 선택하세요.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/quote/bids"
          className="inline-block rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          들어온 입찰 비교하기
        </Link>
        <Link
          to="/"
          className="inline-block rounded-full border border-gray-300 bg-white px-7 py-3 font-semibold text-gray-700 transition hover:border-brand hover:text-brand"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  )
}

export default QuoteDonePage
