import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyQuotes, deleteQuote, updateQuote } from '../services/quotes'
import { useConfirm } from '../context/ConfirmContext'
import { formatDateTime } from '../utils/date'
import StageProgress from './StageProgress'
import DatePicker from './DatePicker'

const MOVE_TYPES = ['포장이사', '반포장이사', '일반이사', '사무실이사']

const STATUS_STYLE = {
  접수: 'bg-amber-100 text-amber-700',
  상담중: 'bg-blue-100 text-blue-600',
  완료: 'bg-brand-light text-brand',
}

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'

// 마이페이지 내 견적 현황 — 신청 견적·입찰/낙찰 상태·취소·수정
function MyQuotesBox({ email }) {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)

  function load() {
    if (!email) {
      setLoading(false)
      return
    }
    getMyQuotes(email)
      .then((d) => setQuotes(Array.isArray(d) ? d : []))
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false))
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  // 견적의 입찰 비교 페이지로 (해당 견적 id를 기준으로)
  function viewBids(q) {
    try {
      localStorage.setItem('movingday_last_quote_id', q.id)
    } catch {
      // 무시
    }
    navigate('/quote/bids')
  }

  async function remove(q) {
    const ok = await confirm({
      title: '견적 취소',
      message: '이 견적을 취소할까요? 들어온 입찰도 함께 삭제됩니다.',
      confirmText: '견적 취소',
      danger: true,
    })
    if (!ok) return
    try {
      await deleteQuote(q.id)
      setQuotes((prev) => prev.filter((x) => x.id !== q.id))
    } catch (err) {
      await confirm({ title: '취소 실패', message: err.message, alertOnly: true })
    }
  }

  async function saveEdit(e, q) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {
      moveType: fd.get('moveType'),
      moveDate: fd.get('moveDate') || null,
      homeSize: fd.get('homeSize')?.toString().trim() || null,
      memo: fd.get('memo')?.toString().trim() || null,
    }
    try {
      const updated = await updateQuote(q.id, data)
      setQuotes((prev) =>
        prev.map((x) => (x.id === q.id ? { ...x, ...updated } : x)),
      )
      setEditId(null)
    } catch (err) {
      await confirm({ title: '수정 실패', message: err.message, alertOnly: true })
    }
  }

  if (loading) {
    return <p className="mt-4 text-sm text-gray-400">불러오는 중…</p>
  }
  if (quotes.length === 0) {
    return (
      <div className="mt-4 rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">아직 신청한 견적이 없어요.</p>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-3">
      {quotes.map((q) => {
        const bidCount = q.bids?.length ?? 0
        const accepted = q.bids?.find((b) => b.status === '낙찰')
        const editing = editId === q.id
        return (
          <div
            key={q.id}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            {editing ? (
              <form onSubmit={(e) => saveEdit(e, q)} className="space-y-3">
                <select
                  name="moveType"
                  defaultValue={q.moveType}
                  className={inputClass}
                >
                  {MOVE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <DatePicker
                  name="moveDate"
                  defaultValue={q.moveDate || ''}
                  minYear={new Date().getFullYear()}
                  placeholder="이사 예정일 선택"
                />
                <input
                  name="homeSize"
                  defaultValue={q.homeSize || ''}
                  placeholder="평형/주거형태 (예: 24평 아파트)"
                  className={inputClass}
                />
                <textarea
                  name="memo"
                  rows={2}
                  defaultValue={q.memo || ''}
                  placeholder="추가 요청사항"
                  className={inputClass}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
                  >
                    취소
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-semibold text-brand">
                        {q.moveType}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          STATUS_STYLE[q.status] || STATUS_STYLE['접수']
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                    <h3 className="mt-2 font-bold text-gray-900">
                      {q.fromRegion} → {q.toRegion}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      {q.homeSize ? `${q.homeSize} · ` : ''}이사 예정{' '}
                      {q.moveDate || '미정'}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-300">
                      {formatDateTime(q.createdAt)} 신청
                    </p>
                    {accepted && (
                      <p className="mt-1 font-semibold break-keep text-brand">
                        ✓ {accepted.company} 낙찰
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right text-sm">
                    <p className="text-gray-400">입찰 {bidCount}건</p>
                  </div>
                </div>
                {/* 낙찰 후엔 진행 단계 표시, 미낙찰은 수정·취소 가능 */}
                {q.stage && (
                  <StageProgress stage={q.stage} logs={q.stageLogs || []} />
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => viewBids(q)}
                    className="text-brand hover:underline"
                  >
                    입찰 보기 →
                  </button>
                  {!q.stage && (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditId(q.id)}
                        className="text-gray-500 hover:text-brand"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(q)}
                        className="text-red-500 hover:text-red-700"
                      >
                        견적 취소
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default MyQuotesBox
