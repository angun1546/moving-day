import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBidsByQuote, acceptBid, cancelBid } from '../services/bids'
import { useConfirm } from '../context/ConfirmContext'
import { addNotification } from '../utils/notifications'
import { usePagination } from '../hooks/usePagination'
import { getRatings } from '../services/reviews'
import Pagination from '../components/Pagination'
import { formatDateTime } from '../utils/date'

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
  const confirm = useConfirm()
  const [sort, setSort] = useState('price')
  const [picked, setPicked] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  // 업체 평점 = 서버 집계(고객 리뷰 이용 업체명 기준 평균, 숨김 제외)
  const [ratings, setRatings] = useState([])
  useEffect(() => {
    getRatings()
      .then((d) => setRatings(Array.isArray(d) ? d : []))
      .catch(() => setRatings([]))
  }, [])
  function companyRating(company) {
    const r = ratings.find((x) => x.company === company)
    return r ? r.avg : 0
  }

  // 방금 신청한 견적 id (견적 신청 시 저장됨)
  let quoteId = ''
  try {
    quoteId = localStorage.getItem('movingday_last_quote_id') || ''
  } catch {
    quoteId = ''
  }

  function load() {
    if (!quoteId) {
      setLoading(false)
      return
    }
    getBidsByQuote(quoteId)
      .then((data) => {
        const arr = Array.isArray(data) ? data : []
        setBids(arr)
        const accepted = arr.find((b) => b.status === '낙찰')
        setPicked(accepted ? accepted.id : null)
      })
      .catch(() => setBids([]))
      .finally(() => setLoading(false))
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId])

  const lowest = bids.length ? Math.min(...bids.map((b) => b.price)) : null

  // 선택 기준 정렬 (최저가 / 최신)
  const sorted = useMemo(() => {
    const arr = [...bids]
    arr.sort((a, b) => {
      if (sort === 'price') return a.price - b.price
      if (sort === 'high') return b.price - a.price
      if (sort === 'ratingHigh')
        return companyRating(b.company) - companyRating(a.company)
      if (sort === 'ratingLow')
        return companyRating(a.company) - companyRating(b.company)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    return arr
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bids, sort, ratings])

  const { page, setPage, totalPages, perPage, setPerPage, pageItems } =
    usePagination(sorted, 5)

  const pickedBid = bids.find((b) => b.id === picked)

  // 낙찰 — 선택 입찰 낙찰·나머지 거절 + 파트너·관리자 알림
  async function handlePick(b) {
    const ok = await confirm({
      title: '업체 선택',
      message: `${b.company}로 낙찰하시겠어요? 선택하면 해당 업체에 알림이 전송됩니다.`,
      confirmText: '낙찰하기',
    })
    if (!ok) return
    try {
      await acceptBid(b.id)
      setPicked(b.id)
      setBids((prev) =>
        prev.map((x) =>
          x.id === b.id
            ? { ...x, status: '낙찰' }
            : { ...x, status: '거절' },
        ),
      )
      // 파트너 낙찰 알림은 서버(award)가 생성 — 여기선 관리자 알림만
      addNotification({
        type: 'bid',
        message: `${b.company}가 낙찰되었습니다.`,
        link: '/admin',
        to: 'admin',
      })
    } catch (err) {
      await confirm({
        title: '낙찰 실패',
        message: err.message || '낙찰 처리에 실패했습니다.',
        alertOnly: true,
      })
    }
  }

  // 낙찰 취소 (계약 전까지) — 입찰 전부 복원 + 알림
  async function handleCancel() {
    if (!pickedBid) return
    const ok = await confirm({
      title: '낙찰 취소',
      message: '낙찰을 취소하시겠어요? 계약 전까지는 다시 업체를 선택할 수 있어요.',
      confirmText: '낙찰 취소',
      danger: true,
    })
    if (!ok) return
    try {
      await cancelBid(pickedBid.id)
      // 파트너 취소 알림은 서버(reject)가 생성 — 여기선 관리자 알림만
      addNotification({
        type: 'bid',
        message: `${pickedBid.company} 낙찰이 취소되었습니다.`,
        link: '/admin',
        to: 'admin',
      })
      setPicked(null)
      setBids((prev) => prev.map((x) => ({ ...x, status: '입찰' })))
    } catch (err) {
      await confirm({
        title: '취소 실패',
        message: err.message || '낙찰 취소에 실패했습니다.',
        alertOnly: true,
      })
    }
  }

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

      {/* 낙찰 완료 배너 + 낙찰 취소 */}
      {pickedBid && (
        <div className="mt-6 rounded-2xl border border-brand-light bg-brand-bg px-5 py-4">
          <p className="font-semibold text-brand-dark">
            ✅ {pickedBid.company}를 선택하셨어요!
          </p>
          <p className="mt-1 text-sm text-gray-600">
            계약 전까지는 낙찰을 취소하고 다시 선택할 수 있어요.
          </p>
          <button
            type="button"
            onClick={handleCancel}
            className="mt-3 rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            낙찰 취소
          </button>
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
          <div className="mt-8 flex flex-wrap gap-2">
            <SortBtn on={sort === 'price'} onClick={() => setSort('price')}>
              최저가순
            </SortBtn>
            <SortBtn on={sort === 'high'} onClick={() => setSort('high')}>
              최고가순
            </SortBtn>
            <SortBtn
              on={sort === 'ratingHigh'}
              onClick={() => setSort('ratingHigh')}
            >
              평점 높은순
            </SortBtn>
            <SortBtn
              on={sort === 'ratingLow'}
              onClick={() => setSort('ratingLow')}
            >
              평점 낮은순
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
              const hasPicked = !!picked
              return (
                <article
                  key={b.id}
                  className={`rounded-3xl border bg-white p-6 shadow-sm transition ${
                    isPicked
                      ? 'border-brand ring-2 ring-brand'
                      : 'border-gray-100 hover:-translate-y-1 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-900">
                        {b.company}
                      </h2>
                      {companyRating(b.company) > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-amber-500">
                          ★ {companyRating(b.company).toFixed(1)}
                        </span>
                      )}
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

                  <p className="mt-3 text-xs text-gray-300">
                    {formatDateTime(b.createdAt)} 입찰
                  </p>

                  <button
                    type="button"
                    onClick={() => handlePick(b)}
                    disabled={hasPicked}
                    className={`mt-5 w-full rounded-full px-6 py-3 font-semibold text-white transition ${
                      isPicked
                        ? 'bg-brand-dark'
                        : hasPicked
                          ? 'cursor-default bg-gray-300'
                          : 'bg-brand hover:bg-brand-dark'
                    }`}
                  >
                    {isPicked ? '낙찰됨 ✓' : hasPicked ? '마감' : '이 업체 선택'}
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
