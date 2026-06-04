import { Link } from 'react-router-dom'
import { documentServices } from '../data/document'

// 문서보관·파쇄 메인 — 어떤 보안·아카이브 상품이 있는지 소개하는 페이지

function DocumentPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-light/40 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 font-inter text-xs font-bold tracking-wider text-brand-dark uppercase">
              For Archive
            </span>
            <h1 className="mt-5 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
              기록은 안전하게,
              <br />
              <span className="text-brand">기밀은 흔적 없이.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              보안 문서·디지털 매체 파쇄부터 장기 보관, 스마트 인덱싱까지. 중요한
              기록을 안전하게 지키고 깔끔하게 폐기하는 상품을 살펴보세요.
            </p>
            <a
              href="#document-services"
              className="mt-8 inline-block rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              상품 보기
            </a>
          </div>
        </div>
      </section>

      {/* 상품 라인업 — 세부 소개 페이지로 이동 */}
      <section
        id="document-services"
        className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20"
      >
        <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
          Lineup
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          문서보관·파쇄 상품 라인업
        </h2>
        <p className="mt-3 text-gray-600">
          보안 파쇄부터 보관·관리까지 5가지 상품을 준비했어요. 카드를 눌러 자세히
          살펴보세요.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documentServices.map((d) => (
            <Link
              key={d.slug}
              to={`/document/${d.slug}`}
              className="group rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl">{d.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-brand">
                {d.label}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {d.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default DocumentPage
