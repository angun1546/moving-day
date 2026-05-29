import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../context/ConfirmContext'
import { getQuotes } from '../services/quotes'
import { createBid } from '../services/bids'
import { addNotification } from '../utils/notifications'
import { formatDateTime } from '../utils/date'
import { usePagination } from '../hooks/usePagination'
import Pagination from '../components/Pagination'

const won = (n) => n.toLocaleString('ko-KR')

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'

// 파트너 업체명 (localStorage 업체정보)
function getCompany() {
  try {
    const p = JSON.parse(localStorage.getItem('movingday_partner_profile') || '{}')
    return p.company || ''
  } catch {
    return ''
  }
}

function PartnerDashboardPage() {
  const { user } = useAuth()
  const confirm = useConfirm()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState(null) // 입찰 폼을 펼친 요청
  const [doneIds, setDoneIds] = useState([]) // 방금 입찰 제출한 요청

  async function load() {
    try {
      const data = await getQuotes()
      setQuotes(Array.isArray(data) ? data : [])
    } catch {
      setQuotes([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])

  const { page, setPage, totalPages, perPage, setPerPage, pageItems } =
    usePagination(quotes, 5)

  // 입찰 제출 → 백엔드 저장
  async function submit(e, quote) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const price = fd.get('price')
    const message = fd.get('message')?.toString().trim() || ''
    const company = getCompany()
    if (!company) {
      await confirm({
        title: '업체 정보 필요',
        message: '입찰하려면 먼저 업체 정보를 등록해 주세요.',
        alertOnly: true,
      })
      return
    }
    try {
      await createBid({
        quoteRequestId: quote.id,
        bidderEmail: user?.email || '',
        company,
        price,
        message,
      })
      setDoneIds((prev) => [...prev, quote.id])
      setOpenId(null)
      // 파트너 마이페이지 활동 카운트
      try {
        const cur = parseInt(
          localStorage.getItem('movingday_partner_bid_count') || '0',
          10,
        )
        localStorage.setItem('movingday_partner_bid_count', String(cur + 1))
      } catch {
        // 저장 실패 무시
      }
      addNotification({
        type: 'bid',
        message: `${quote.fromRegion} → ${quote.toRegion} 건에 입찰을 제출했어요.`,
        link: '/partner/dashboard',
      })
      load() // 입찰 수 갱신
    } catch (err) {
      await confirm({
        title: '입찰 실패',
        message: err.message || '입찰에 실패했습니다.',
        alertOnly: true,
      })
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">들어온 견적 요청</h1>
      <p className="mt-2 text-gray-600">
        고객의 이사 정보를 확인하고 입찰가를 제시하세요. 좋은 조건일수록 낙찰
        확률이 높아집니다.
      </p>

      {loading ? (
        <p className="mt-10 text-center text-gray-400">불러오는 중…</p>
      ) : quotes.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-4 font-semibold text-gray-700">
            아직 들어온 견적 요청이 없어요
          </p>
          <p className="mt-1 text-sm text-gray-500">
            새 견적이 들어오면 여기에 표시됩니다.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {pageItems.map((r) => {
              const done = doneIds.includes(r.id)
              const open = openId === r.id
              const bidCount = r.bids?.length ?? 0
              const lowest = bidCount
                ? Math.min(...r.bids.map((b) => b.price))
                : null
              return (
                <article
                  key={r.id}
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  {/* 요청 정보 (개인정보 제외 — 지역·종류만) */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                        {r.moveType}
                      </span>
                      <h2 className="mt-3 text-lg font-bold text-gray-900">
                        {r.fromRegion} → {r.toRegion}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {r.homeSize || '주거형태 미입력'} · 이사 예정{' '}
                        {r.moveDate || '미정'}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-300">
                        {formatDateTime(r.createdAt)} 신청
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-400">현재 입찰 {bidCount}건</p>
                      {lowest != null && (
                        <p className="font-inter font-bold text-brand">
                          최저 {won(lowest)}원
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 입찰 영역: 완료 / 폼 / 버튼 */}
                  {done ? (
                    <p className="mt-5 rounded-xl bg-brand-bg px-4 py-3 text-sm font-semibold text-brand-dark">
                      ✓ 입찰을 제출했습니다. 낙찰되면 알림을 보내드릴게요.
                    </p>
                  ) : open ? (
                    <form
                      onSubmit={(e) => submit(e, r)}
                      className="mt-5 space-y-4 border-t border-gray-100 pt-5"
                    >
                      <label className="block">
                        <span className="text-sm font-semibold text-gray-800">
                          견적가 (원)<span className="text-brand"> *</span>
                        </span>
                        <input
                          type="number"
                          name="price"
                          required
                          min="0"
                          placeholder="예: 280000"
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold text-gray-800">
                          고객에게 한마디
                        </span>
                        <textarea
                          name="message"
                          rows={3}
                          placeholder="제공 서비스, 우리 업체의 강점 등을 적어주세요."
                          className={inputClass}
                        />
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
                        >
                          입찰 제출
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenId(null)}
                          className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOpenId(r.id)}
                      className="mt-5 w-full rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
                    >
                      입찰하기
                    </button>
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
      )}
    </section>
  )
}

export default PartnerDashboardPage
