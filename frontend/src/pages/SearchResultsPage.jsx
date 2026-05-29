import { Link, useSearchParams } from 'react-router-dom'
import HeroSearch from '../components/HeroSearch'
import {
  USER_PAGES,
  PARTNER_PAGES,
  USER_SUGGESTIONS,
  PARTNER_SUGGESTIONS,
  searchPages,
} from '../data/searchIndex'

// 검색 결과 페이지 — 고객/파트너 공용 (scope로 인덱스·경로 분기)
function SearchResultsPage({ scope = 'user' }) {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''

  const isPartner = scope === 'partner'
  const pages = isPartner ? PARTNER_PAGES : USER_PAGES
  const suggestions = isPartner ? PARTNER_SUGGESTIONS : USER_SUGGESTIONS
  const homePath = isPartner ? '/partner' : '/'

  const results = searchPages(pages, q)
  // 검색어가 없으면 전체 페이지를 안내한다
  const list = q ? results : pages
  const noResult = q && results.length === 0

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        Search
      </p>
      <h1 className="mt-2 text-2xl font-bold break-keep text-gray-900 md:text-3xl">
        {q ? (
          <>
            ‘<span className="text-brand">{q}</span>’ 검색 결과
          </>
        ) : (
          '무엇을 찾으세요?'
        )}
      </h1>
      <p className="mt-2 text-gray-600">
        {q
          ? `${results.length}개의 관련 페이지를 찾았어요.`
          : '검색어를 입력하면 관련 페이지를 찾아드려요.'}
      </p>

      {/* 재검색 */}
      <div className="mt-6">
        <HeroSearch scope={scope} suggestions={suggestions} />
      </div>

      {noResult ? (
        <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-4 font-semibold text-gray-700">검색 결과가 없어요</p>
          <p className="mt-1 text-sm text-gray-500">
            다른 검색어로 시도하거나 아래에서 바로 이동해 보세요.
          </p>
          <Link
            to={homePath}
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            홈으로
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {list.map((p) => (
            <li key={p.path}>
              <Link
                to={p.path}
                className="flex h-full items-start gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-3xl">{p.icon}</span>
                <div>
                  <h2 className="font-bold text-gray-900">{p.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">
                    {p.desc}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default SearchResultsPage
