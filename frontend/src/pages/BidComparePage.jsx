import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BIDS } from '../data/bids'

// 천 단위 콤마
const won = (n) => n.toLocaleString('ko-KR')

// 정렬 토글 버튼
function SortBtn({ on, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        on
          ? 'bg-brand text-white'
          : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:text-brand'
      }`}
    >
      {children}
    </button>
  )
}

function BidComparePage() {
  const [sort, setSort] = useState('price')
  const [picked, setPicked] = useState(null)

  // 배지용 최저가 / 최고 평점
  const lowest = Math.min(...BIDS.map((b) => b.price))
  const topRating = Math.max(...BIDS.map((b) => b.rating))

  // 선택한 기준으로 정렬
  const sorted = useMemo(() => {
    const arr = [...BIDS]
    arr.sort((a, b) =>
      sort === 'price' ? a.price - b.price : b.rating - a.rating,
    )
    return arr
  }, [sort])

  const pickedBid = BIDS.find((b) => b.id === picked)

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <Link
        to="/quote/done"
        className="text-sm text-gray-500 transition hover:text-brand"
      >
        ← 신청 완료
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        {BIDS.length}개 업체가 입찰했어요
      </h1>
      <p className="mt-3 text-gray-600">
        검증된 이사업체들이 제시한 조건을 비교하고, 가장 좋은 곳을 선택하세요.
      </p>

      {/* 선택 완료 배너 */}
      {pickedBid && (
        <div className="mt-6 rounded-2xl border border-brand-light bg-brand-bg px-5 py-4">
          <p className="font-semibold text-brand-dark">
            ✅ {pickedBid.company}를 선택하셨어요!
          </p>
          <p className="mt-1 text-sm text-gray-600">
            선택하신 업체가 곧 연락드릴 예정입니다. 안심하고 기다려 주세요.
          </p>
        </div>
      )}

      {/* 정렬 토글 */}
      <div className="mt-8 flex gap-2">
        <SortBtn on={sort === 'price'} onClick={() => setSort('price')}>
          최저가순
        </SortBtn>
        <SortBtn on={sort === 'rating'} onClick={() => setSort('rating')}>
          평점순
        </SortBtn>
      </div>

      {/* 입찰 목록 */}
      <div className="mt-6 space-y-4">
        {sorted.map((b) => {
          const isLowest = b.price === lowest
          const isTop = b.rating === topRating
          const isPicked = picked === b.id
          return (
            <article
              key={b.id}
              className={`rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                isPicked ? 'border-brand ring-2 ring-brand' : 'border-gray-100'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{b.company}</h2>
                    {isLowest && (
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                        최저가
                      </span>
                    )}
                    {isTop && (
                      <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-bold text-brand">
                        평점 1위
                      </span>
                    )}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-sm">
                    <span className="text-amber-400">★</span>
                    <span className="font-semibold text-gray-900">{b.rating}</span>
                    <span className="text-gray-400">후기 {won(b.reviews)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-inter text-2xl font-bold text-brand">
                    {won(b.price)}원
                  </p>
                  <p className="text-xs text-gray-400">예상 소요 {b.eta}</p>
                </div>
              </div>

              <p className="mt-4 leading-relaxed text-gray-600">{b.message}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {b.services.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPicked(b.id)}
                disabled={isPicked}
                className="mt-5 w-full rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-default disabled:bg-brand-dark"
              >
                {isPicked ? '선택됨 ✓' : '이 업체 선택'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default BidComparePage
