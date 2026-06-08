import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { USER_PAGES, PARTNER_PAGES, searchPages } from '../data/searchIndex'

// Hero용 큰 검색창 — 입력 시 연관 페이지를 드롭다운으로 추천, 검색 시 결과 페이지로 이동
// scope: 'user' → /search, 'partner' → /partner/search
function HeroSearch({
  scope = 'user',
  suggestions = [],
  centered = false,
}: {
  scope?: 'user' | 'partner'
  suggestions?: string[]
  centered?: boolean
}) {
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()

  const isPartner = scope === 'partner'
  const base = isPartner ? '/partner/search' : '/search'
  const pages = isPartner ? PARTNER_PAGES : USER_PAGES
  const placeholder = isPartner
    ? '무엇을 찾으세요? 예: 입찰, 업체 정보, 수수료'
    : '무엇을 찾으세요? 예: 가정이사, 기업 이사, 후기'

  // 입력어와 연관된 페이지 (최대 6개)
  const matches = q.trim() ? searchPages(pages, q).slice(0, 6) : []
  const showDropdown = focused && q.trim().length > 0

  // 검색어로 결과 페이지 이동 (빈 값이면 전체 목록 페이지로)
  function go(query: string) {
    const v = query.trim()
    navigate(v ? `${base}?q=${encodeURIComponent(v)}` : base)
  }

  return (
    <div className={`relative w-full max-w-2xl ${centered ? 'mx-auto' : ''}`}>
      <form
        data-no-lift
        onSubmit={(e) => {
          e.preventDefault()
          go(q)
        }}
        className="flex flex-col gap-2 rounded-3xl bg-white p-2 shadow-lg ring-1 ring-brand/10 sm:flex-row sm:items-center sm:rounded-full sm:pl-6"
      >
        <div className="flex flex-1 items-center gap-3 px-4 sm:px-0">
          <svg
            className="shrink-0 text-brand"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            aria-label="사이트 검색"
            autoComplete="off"
            className="w-full bg-transparent py-3 text-base outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          type="submit"
          data-no-tap
          className="rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          검색
        </button>
      </form>

      {/* 자동완성 — 연관 페이지 드롭다운 */}
      {showDropdown && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-3xl border border-gray-100 bg-white p-2 text-left shadow-xl">
          {/* 현재 검색어로 결과 페이지 보기 */}
          <button
            type="button"
            data-no-tap
            onMouseDown={(e) => {
              e.preventDefault()
              go(q)
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-brand-bg"
          >
            <span className="text-xl">🔍</span>
            <span className="text-sm text-gray-700">
              ‘<span className="font-semibold text-brand">{q}</span>’ 검색 결과 보기
            </span>
          </button>

          {matches.length > 0 && (
            <>
              <div className="my-1 border-t border-gray-100" />
              <p className="px-4 py-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                연관 페이지
              </p>
              {matches.map((p) => (
                <button
                  key={p.path}
                  type="button"
                  data-no-tap
                  onMouseDown={(e) => {
                    e.preventDefault()
                    navigate(p.path)
                  }}
                  className="flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-brand-bg"
                >
                  <span className="text-2xl">{p.icon}</span>
                  <span>
                    <span className="block font-semibold text-gray-900">
                      {p.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-gray-500">
                      {p.desc}
                    </span>
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* 추천 검색어 칩 (입력 전) */}
      {suggestions.length > 0 && !showDropdown && (
        <div
          className={`mt-4 flex flex-wrap items-center gap-2 ${
            centered ? 'justify-center' : ''
          }`}
        >
          <span className="text-sm text-gray-500">추천 검색어</span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => go(s)}
              className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-sm text-gray-600 transition hover:border-brand hover:text-brand"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default HeroSearch
