import { Link } from 'react-router-dom'
import { cleaningServices } from '../data/cleaning'

// 청소 메인 — '어떤 청소 상품이 있는지' 소개하는 페이지 (견적/상담 X)
// 각 서비스 카드는 세부 상품 소개 페이지로 이동

function CleaningPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-light/40 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 font-inter text-xs font-bold tracking-wider text-brand-dark uppercase">
              For Cleaning
            </span>
            <h1 className="mt-5 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
              공간을 새것처럼,
              <br />
              <span className="text-brand">이삿날 청소.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              입주 청소부터 사무실 정기 청소, 의자 딥클린까지. 이삿날이 준비한
              청소 상품을 살펴보고 우리 공간에 맞는 케어를 찾아보세요.
            </p>
            <a
              href="#cleaning-services"
              className="mt-8 inline-block rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              청소 상품 보기
            </a>
          </div>
        </div>
      </section>

      {/* 청소 상품 — 세부 소개 페이지로 이동 */}
      <section
        id="cleaning-services"
        className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20"
      >
        <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
          Lineup
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">청소 상품 라인업</h2>
        <p className="mt-3 text-gray-600">
          공간과 목적에 맞춘 3가지 청소 상품을 준비했어요. 카드를 눌러 자세히
          살펴보세요.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cleaningServices.map((c) => (
            <Link
              key={c.slug}
              to={`/cleaning/${c.slug}`}
              className="group rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl">{c.icon}</span>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand">
                  {c.label}
                </h3>
                <span className="shrink-0 rounded-full bg-brand-light px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-brand">
                  {c.sub}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {c.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default CleaningPage
