import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBidsByQuote } from '../services/bids'
import { usePagination } from '../hooks/usePagination'
import Pagination from '../components/Pagination'

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
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)

  // 방금 신청한 견적 id (견적 신청 시 저장됨)
  let quoteId = ''
  try {
    quoteId = localStorage.getItem('movingday_last_quote_id') || ''
  } catch {
    quoteId = ''
  }

  useEffect(() => {
    if (!quoteId) {
      setLoading(false)
      return
    }
    getBidsByQuote(quoteId)
      .then((data) => setBids(Array.isArray(data) ? data : []))
      .catch(() => setBids([]))
      .finally(() => setLoading(false))
  }, [quoteId])

  const lowest = bids.length ? Math.min(...bids.map((b) => b.price)) : null

  // 선택 기준 정렬 (최저가 / 최신)
  const sorted = useMemo(() => {
    const arr = [...bids]
    arr.sort((a, b) =>
      sort === 'price'
        ? a.price - b.price
        : new Date(b.createdAt) - new Date(a.createdAt),
    )
    return arr
  }, [bids, sort])

  const { page, setPage, totalPages, perPage, setPerPage, pageItems } =
    usePagination(sorted, 5)

  const pickedBid = bids.find((b) => b.id === picked)

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <Link
        to="/quote/done"
        className="text-sm text-gray-500 transition hover:text-brand"
      >
        ← 신청 완료
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        {bids.length > 0 ? `${bids.length}개 업체가 입찰했어요` : '받은 입찰'}
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

      {loading ? (
        <p className="mt-10 text-center text-gray-400">불러오는 중…</p>
      ) : !quoteId ? (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-4xl">📝</p>
          <p className="mt-4 font-semibold text-gray-700">
            먼저 견적을 신청해 주세요
          </p>
          <p className="mt-1 text-sm text-gray-500">
            견적을 신청하면 업체들의 입찰을 여기서 비교할 수 있어요.
          </p>
          <Link
            to="/quote"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            견적 신청하기
          </Link>
        </div>
      ) : bids.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-4xl">⏳</p>
          <p className="mt-4 font-semibold text-gray-700">
            아직 들어온 입찰이 없어요
          </p>
          <p className="mt-1 text-sm text-gray-500">
            업체들이 견적을 검토하고 있어요. 입찰이 들어오면 알림을 보내드릴게요.
          </p>
        </div>
      ) : (
        <>
          {/* 정렬 토글 */}
          <div className="mt-8 flex gap-2">
            <SortBtn on={sort === 'price'} onClick={() => setSort('price')}>
              최저가순
            </SortBtn>
            <SortBtn on={sort === 'recent'} onClick={() => setSort('recent')}>
              최신순
            </SortBtn>
          </div>

          {/* 입찰 목록 */}
          <div className="mt-6 space-y-4">
            {pageItems.map((b) => {
              const isLowest = b.price === lowest
              const isPicked = picked === b.id
              return (
                <article
                  key={b.id}
                  className={`rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                    isPicked ? 'border-brand ring-2 ring-brand' : 'border-gray-100'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-900">
                        {b.company}
                      </h2>
                      {isLowest && (
                        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                          최저가
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-inter text-2xl font-bold text-brand">
                        {won(b.price)}원
                      </p>
                      {b.eta && (
                        <p className="text-xs text-gray-400">예상 소요 {b.eta}</p>
                      )}
                    </div>
                  </div>

                  {b.message && (
                    <p className="mt-4 leading-relaxed text-gray-600">
                      {b.message}
                    </p>
                  )}

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
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            perPage={perPage}
            setPerPage={setPerPage}
          />
        </>
      )}
    </section>
  )
}

export default BidComparePage
