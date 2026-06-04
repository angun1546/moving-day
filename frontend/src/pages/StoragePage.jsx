import { Link } from 'react-router-dom'
import { storageServices } from '../data/storage'

// 창고보관 메인 — 어떤 보관 상품이 있는지 소개하는 페이지
// 각 상품 카드는 세부 소개 페이지로 이동

function StoragePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-light/40 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 font-inter text-xs font-bold tracking-wider text-brand-dark uppercase">
              For Storage
            </span>
            <h1 className="mt-5 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
              필요한 만큼,
              <br />
              <span className="text-brand">안전하게 보관.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              컨테이너부터 대형 창고, 모듈형 보관, 무빙박스까지. 이삿날이 준비한
              보관 상품을 살펴보고 우리 짐에 맞는 방식을 찾아보세요.
            </p>
            <a
              href="#storage-services"
              className="mt-8 inline-block rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              보관 상품 보기
            </a>
          </div>
        </div>
      </section>

      {/* 보관 상품 — 세부 소개 페이지로 이동 */}
      <section
        id="storage-services"
        className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20"
      >
        <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
          Lineup
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">보관 상품 라인업</h2>
        <p className="mt-3 text-gray-600">
          짐의 양과 기간에 맞춘 4가지 보관 상품을 준비했어요. 카드를 눌러 자세히
          살펴보세요.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {storageServices.map((s) => (
            <Link
              key={s.slug}
              to={`/storage/${s.slug}`}
              className="group rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl">{s.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-brand">
                {s.label}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {s.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default StoragePage
