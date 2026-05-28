import { useState } from 'react'
import { REQUESTS } from '../data/requests'
import { addNotification } from '../utils/notifications'

const won = (n) => n.toLocaleString('ko-KR')

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'

function PartnerDashboardPage() {
  const [openId, setOpenId] = useState(null) // 입찰 폼을 펼친 요청
  const [doneIds, setDoneIds] = useState([]) // 입찰을 제출한 요청

  // 입찰 제출 (목업: 실제 저장 없이 완료 처리)
  function submit(e, id) {
    e.preventDefault()
    setDoneIds((prev) => [...prev, id])
    setOpenId(null)
    // 파트너 마이페이지 활동 내역 카운트
    try {
      const cur = parseInt(
        localStorage.getItem('movingday_partner_bid_count') || '0',
        10,
      )
      localStorage.setItem('movingday_partner_bid_count', String(cur + 1))
    } catch {
      // 저장 실패 무시
    }
    // 알림 추가 — 클릭 시 파트너 대시보드로
    const req = REQUESTS.find((r) => r.id === id)
    addNotification({
      type: 'bid',
      message: req
        ? `${req.from} → ${req.to} 건에 입찰을 제출했어요.`
        : '입찰을 제출했어요.',
      link: '/partner/dashboard',
    })
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">들어온 견적 요청</h1>
      <p className="mt-2 text-gray-600">
        고객의 이사 정보를 확인하고 입찰가를 제시하세요. 좋은 조건일수록 낙찰
        확률이 높아집니다.
      </p>

      <div className="mt-8 space-y-4">
        {REQUESTS.map((r) => {
          const done = doneIds.includes(r.id)
          const open = openId === r.id
          return (
            <article
              key={r.id}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              {/* 요청 정보 */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                    {r.moveType}
                  </span>
                  <h2 className="mt-3 text-lg font-bold text-gray-900">
                    {r.from} → {r.to}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {r.homeSize} · 이사 예정 {r.moveDate}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-gray-400">현재 입찰 {r.bidCount}건</p>
                  <p className="font-inter font-bold text-brand">
                    최저 {won(r.lowestBid)}원
                  </p>
                </div>
              </div>

              {/* 입찰 영역: 완료 / 폼 / 버튼 */}
              {done ? (
                <p className="mt-5 rounded-xl bg-brand-bg px-4 py-3 text-sm font-semibold text-brand-dark">
                  ✓ 입찰을 제출했습니다. 낙찰되면 알림을 보내드릴게요.
                </p>
              ) : open ? (
                <form
                  onSubmit={(e) => submit(e, r.id)}
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
    </section>
  )
}

export default PartnerDashboardPage
