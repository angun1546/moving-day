import { Link, useParams } from 'react-router-dom'
import { documentServices, findDocument } from '../data/document'

// 문서보관·파쇄 세부 상품 소개 페이지
function DocumentDetailPage() {
  const { slug } = useParams()
  const d = findDocument(slug)

  if (!d) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900">상품을 찾을 수 없어요</h1>
        <Link
          to="/document"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          상품 보기
        </Link>
      </section>
    )
  }

  const others = documentServices.filter((o) => o.slug !== d.slug)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-light/40 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Link
            to="/document"
            className="text-sm text-gray-500 transition hover:text-brand"
          >
            ← 문서보관·파쇄
          </Link>
          <div className="mt-4 max-w-2xl">
            <span className="text-4xl">{d.icon}</span>
            <h1 className="mt-3 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
              {d.label}
            </h1>
            <p className="mt-3 text-lg font-semibold text-brand">{d.tagline}</p>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              {d.intro}
            </p>
          </div>
        </div>
      </section>

      {/* 상품 특징 */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
          Point
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          이런 점이 좋아요
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {d.points.map((p) => (
            <div
              key={p.title}
              className="flex min-h-28 gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <span className="text-3xl">{p.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 다른 상품 */}
      <section className="bg-brand-light/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900">다른 상품</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`/document/${o.slug}`}
                className="group rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-3xl">{o.icon}</span>
                <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-brand">
                  {o.label}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  {o.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default DocumentDetailPage
