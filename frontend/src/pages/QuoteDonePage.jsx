import { Link } from 'react-router-dom'

function QuoteDonePage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="text-6xl">✅</div>
      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        이사 견적 신청이 완료되었습니다
      </h1>
      <p className="mt-4 leading-relaxed text-gray-600">
        입력해 주신 연락처로 검증된 업체의 견적을 전달드릴게요.
        <br />
        보통 1영업일 이내에 연락드립니다.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
      >
        홈으로 돌아가기
      </Link>
    </section>
  )
}

export default QuoteDonePage
