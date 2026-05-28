import { Link } from 'react-router-dom'
import { METHODS } from '../data/quoteOptions'
import QuoteSteps from '../components/QuoteSteps'

function QuoteMethodPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <QuoteSteps current={1} />
      <h1 className="text-3xl font-bold text-gray-900">어떻게 견적을 받으시겠어요?</h1>
      <p className="mt-3 text-gray-600">
        편한 방식을 선택하세요. 다음 단계에서 이사 종류를 고릅니다.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {METHODS.map((m) => (
          <Link
            key={m.slug}
            to={`/quote/${m.slug}`}
            className="group rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span className="text-4xl">{m.icon}</span>
              {m.badge && (
                <span className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand">
                  {m.badge}
                </span>
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-brand">
              {m.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{m.desc}</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand">
              선택하기 →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default QuoteMethodPage
