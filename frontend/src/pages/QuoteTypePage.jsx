import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { TYPES, TYPE_GROUPS, findMethod, findType } from '../data/quoteOptions'
import QuoteSteps from '../components/QuoteSteps'

// 진입 범위별 노출 그룹 (없으면 전체)
const SCOPE_GROUPS = {
  home: ['가정 이사'],
  business: ['기업·관공서 이사'],
}

function QuoteTypePage() {
  const { method } = useParams()
  const m = findMethod(method)
  const [params] = useSearchParams()
  const scope = params.get('scope')
  const preType = params.get('type')
  const groups = SCOPE_GROUPS[scope] || TYPE_GROUPS
  const backToMethod = scope ? `/quote?scope=${scope}` : '/quote'

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

  // 세부 카테고리를 미리 고르고 들어온 경우: 종류 선택을 건너뛰고 폼으로 바로 이동
  if (preType && findType(preType)) {
    return <Navigate to={`/quote/${m.slug}/${preType}`} replace />
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <QuoteSteps current={2} />
      <Link
        to={backToMethod}
        className="text-sm text-gray-500 transition hover:text-brand"
      >
        ← 견적 방식
      </Link>
      <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-sm font-semibold text-brand">
        {m.icon} {m.title}
      </p>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">어떤 이사를 도와드릴까요?</h1>
      <p className="mt-3 text-gray-600">이사 종류를 선택하면 신청서로 이동합니다.</p>

      {groups.map((group) => (
        <div key={group} className="mt-10">
          <h2 className="text-sm font-semibold tracking-wider text-brand uppercase">
            {group}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {TYPES.filter((t) => t.group === group).map((t) => (
              <Link
                key={t.slug}
                to={`/quote/${m.slug}/${t.slug}`}
                className="group flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-3xl">{t.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand">
                    {t.label}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export default QuoteTypePage
