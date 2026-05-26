import { Link } from 'react-router-dom'

const STATS = [
  { value: '12,000+', label: '누적 견적 신청' },
  { value: '350+', label: '등록 이사 업체' },
  { value: '4.9', label: '평균 만족도' },
]

function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        Trusted Moving Platform
      </p>
      <h1 className="mt-4 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
        이사, 고민은 줄이고
        <br />
        <span className="text-brand">견적은 한 번에.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
        포장이사부터 사무실 이사까지. 검증된 업체들의 견적을 무료로 비교하고,
        합리적인 가격에 안심하고 맡기세요.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/quote"
          className="rounded-full bg-brand px-7 py-3 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          오늘 바로 견적 받기
        </Link>
        <a
          href="#services"
          className="rounded-full border border-gray-300 bg-white px-7 py-3 text-center font-semibold text-gray-700 transition hover:border-brand hover:text-brand"
        >
          서비스 알아보기
        </a>
      </div>

      <dl className="mt-16 grid grid-cols-3 gap-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm"
          >
            <dt className="font-inter text-2xl font-bold text-brand md:text-3xl">
              {s.value}
            </dt>
            <dd className="mt-1 text-xs text-gray-500 md:text-sm">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default HeroSection
