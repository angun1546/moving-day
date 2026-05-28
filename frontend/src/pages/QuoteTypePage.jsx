import { Link, useParams } from 'react-router-dom'
import { TYPES, findMethod } from '../data/quoteOptions'
import QuoteSteps from '../components/QuoteSteps'

function QuoteTypePage() {
  const { method } = useParams()
  const m = findMethod(method)

  if (!m) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900">잘못된 접근이에요</h1>
        <Link
          to="/quote"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          견적 방식 다시 선택
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <QuoteSteps current={2} />
      <Link to="/quote" className="text-sm text-gray-500 transition hover:text-brand">
        ← 견적 방식
      </Link>
      <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-sm font-semibold text-brand">
        {m.icon} {m.title}
      </p>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">어떤 이사를 도와드릴까요?</h1>
      <p className="mt-3 text-gray-600">이사 종류를 선택하면 신청서로 이동합니다.</p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {TYPES.map((t) => (
          <Link
            key={t.slug}
            to={`/quote/${m.slug}/${t.slug}`}
            className="group flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <span className="text-3xl">{t.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand">
                {t.label}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{t.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default QuoteTypePage
