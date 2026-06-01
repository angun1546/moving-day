import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Hero용 큰 검색창 — 검색 시 연관 페이지 검색 결과로 이동
// scope: 'user' → /search, 'partner' → /partner/search
function HeroSearch({ scope = 'user', suggestions = [], centered = false }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const base = scope === 'partner' ? '/partner/search' : '/search'
  const placeholder =
    scope === 'partner'
      ? '무엇을 찾으세요? 예: 입찰, 업체 정보, 수수료'
      : '무엇을 찾으세요? 예: 포장이사, 견적 비교, 후기'

  // 검색어로 결과 페이지 이동 (빈 값이면 전체 목록 페이지로)
  function go(query) {
    const v = query.trim()
    navigate(v ? `${base}?q=${encodeURIComponent(v)}` : base)
  }

  return (
    <div className={`w-full max-w-2xl ${centered ? 'mx-auto' : ''}`}>
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
            placeholder={placeholder}
            aria-label="사이트 검색"
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

      {suggestions.length > 0 && (
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
