import { Link } from 'react-router-dom'

function CtaBanner() {
  return (
    <section className="bg-brand-dark">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          오늘 바로, 이사 견적 받기
        </h2>
        <p className="mt-3 text-brand-light">
          1분이면 충분합니다. 지금 무료로 비교해 보세요.
        </p>
        <Link
          to="/quote"
          className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-brand transition hover:-translate-y-0.5"
        >
          무료 견적 신청
        </Link>
      </div>
    </section>
  )
}

export default CtaBanner
