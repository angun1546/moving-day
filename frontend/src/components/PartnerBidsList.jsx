import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyBids } from '../services/bids'
import { updateQuoteStage } from '../services/quotes'
import { useConfirm } from '../context/ConfirmContext'
import { MOVE_STAGES } from '../data/stages'
import { usePagination } from '../hooks/usePagination'
import Pagination from './Pagination'
import StageProgress from './StageProgress'
import { formatDateTime } from '../utils/date'

const won = (n) => n.toLocaleString('ko-KR')

const STATUS_STYLE = {
  입찰: 'bg-amber-100 text-amber-700',
  낙찰: 'bg-brand-light text-brand',
  거절: 'bg-gray-100 text-gray-500',
}

// 파트너 내 입찰 목록 + 낙찰건 이사 단계 진행 (페이지·마이페이지 공용)
function PartnerBidsList({ email }) {
  const confirm = useConfirm()
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!email) {
      setLoading(false)
      return
    }
    getMyBids(email)
      .then((d) => setBids(Array.isArray(d) ? d : []))
      .catch(() => setBids([]))
      .finally(() => setLoading(false))
  }, [email])

  const { page, setPage, totalPages, perPage, setPerPage, pageItems } =
    usePagination(bids, 5)

  // 낙찰받은 건의 이사 단계 진행
  async function advanceStage(b) {
    const q = b.quoteRequest
    if (!q) return
    const idx = MOVE_STAGES.indexOf(q.stage)
    const next = MOVE_STAGES[idx + 1]
    if (!next) return
    try {
      await updateQuoteStage(q.id, next)
      setBids((prev) =>
        prev.map((x) =>
          x.id === b.id
            ? { ...x, quoteRequest: { ...x.quoteRequest, stage: next } }
            : x,
        ),
      )
    } catch (err) {
      await confirm({
        title: '단계 변경 실패',
        message: err.message || '단계 변경에 실패했습니다.',
        alertOnly: true,
      })
    }
  }

  if (loading) {
    return <p className="text-center text-sm text-gray-400">불러오는 중…</p>
  }
  if (bids.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-4xl">📭</p>
        <p className="mt-4 font-semibold text-gray-700">
          아직 제출한 입찰이 없어요
        </p>
        <p className="mt-1 text-sm text-gray-500">
          들어온 견적 요청에 입찰하고 새로운 고객을 만나보세요.
        </p>
        <Link
          to="/partner/dashboard"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          견적 요청 보러 가기
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {pageItems.map((b) => {
          const q = b.quoteRequest
          return (
            <article
              key={b.id}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {q?.moveType && (
                      <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                        {q.moveType}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        STATUS_STYLE[b.status] || STATUS_STYLE['입찰']
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-gray-900">
                    {q ? `${q.fromRegion} → ${q.toRegion}` : '견적 정보 없음'}
                  </h3>
                  {q && (
                    <p className="mt-1 text-sm text-gray-500">
                      이사 예정 {q.moveDate || '미정'}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-gray-300">
                    {formatDateTime(b.createdAt)} 입찰
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-inter text-2xl font-bold text-brand">
                    {won(b.price)}원
                  </p>
                  {b.eta && (
                    <p className="text-xs text-gray-400">예상 소요 {b.eta}</p>
                  )}
                </div>
              </div>

              {b.message && (
                <p className="mt-4 rounded-xl bg-brand-bg px-4 py-3 text-sm leading-relaxed text-gray-600">
                  {b.message}
                </p>
              )}

              {/* 낙찰받은 건 — 이사 진행 단계 */}
              {b.status === '낙찰' && q?.stage && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-800">
                    이사 진행 단계
                  </p>
                  <StageProgress stage={q.stage} />
                  {MOVE_STAGES.indexOf(q.stage) < MOVE_STAGES.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => advanceStage(b)}
                      className="mt-3 w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
                    >
                      다음 단계로 ({MOVE_STAGES[MOVE_STAGES.indexOf(q.stage) + 1]}
                      )
                    </button>
                  ) : (
                    <p className="mt-3 text-center text-sm font-bold text-brand">
                      🎉 이사 완료
                    </p>
                  )}
                </div>
              )}
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
  )
}

export default PartnerBidsList
