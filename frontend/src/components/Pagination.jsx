// 공용 페이지네이션 — 페이지당 개수 선택 + 이전/다음 + 페이지 번호(최대 5개)
const PER_OPTIONS = [5, 10, 15, 20, 30, 40]

function Pagination({ page, setPage, totalPages, perPage, setPerPage }) {
  const showPages = totalPages > 1
  const showPerPage = typeof setPerPage === 'function'
  if (!showPages && !showPerPage) return null

  // 현재 페이지 주변 최대 5개 번호만 노출
  const win = 5
  let start = Math.max(1, page - Math.floor(win / 2))
  const end = Math.min(totalPages, start + win - 1)
  start = Math.max(1, end - win + 1)
  const nums = []
  for (let i = start; i <= end; i += 1) nums.push(i)

  const btn = 'min-w-9 rounded-full px-3 py-1.5 text-sm font-semibold transition'
  const ghost =
    'border border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
  const off = 'disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600'

  return (
    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      {/* 페이지당 개수 선택 */}
      {showPerPage ? (
        <label className="flex items-center gap-2 text-sm text-gray-500">
          페이지당
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-700 outline-none transition focus:border-brand"
          >
            {PER_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}개
              </option>
            ))}
          </select>
        </label>
      ) : (
        <span />
      )}

      {/* 페이지 번호 */}
      {showPages && (
        <nav
          className="flex flex-wrap items-center justify-center gap-1.5"
          aria-label="페이지네이션"
        >
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`${btn} ${ghost} ${off}`}
          >
            이전
          </button>
          {nums.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === page ? 'page' : undefined}
              className={`${btn} ${n === page ? 'bg-brand text-white' : ghost}`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className={`${btn} ${ghost} ${off}`}
          >
            다음
          </button>
        </nav>
      )}
    </div>
  )
}

export default Pagination
