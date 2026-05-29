import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyBids } from '../services/bids'
import { usePagination } from '../hooks/usePagination'
import Pagination from '../components/Pagination'

const won = (n) => n.toLocaleString('ko-KR')

// 입찰 상태 배지 색
const STATUS_STYLE = {
  입찰: 'bg-amber-100 text-amber-700',
  낙찰: 'bg-brand-light text-brand',
  거절: 'bg-gray-100 text-gray-500',
}

function PartnerBidsPage() {
  const { user } = useAuth()
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.email) {
      setLoading(false)
      return
    }
    getMyBids(user.email)
      .then((d) => setBids(Array.isArray(d) ? d : []))
      .catch(() => setBids([]))
      .finally(() => setLoading(false))
  }, [user])

  const { page, setPage, totalPages, perPage, setPerPage, pageItems } =
    usePagination(bids, 5)

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">내 입찰 현황</h1>
      <p className="mt-2 text-gray-600">
        제출한 입찰과 진행 상태를 한눈에 확인하세요.
      </p>

      {loading ? (
        <p className="mt-10 text-center text-gray-400">불러오는 중…</p>
      ) : bids.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
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
      ) : (
        <>
          <div className="mt-8 space-y-4">
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
                      <h2 className="mt-3 text-lg font-bold text-gray-900">
                        {q ? `${q.fromRegion} → ${q.toRegion}` : '견적 정보 없음'}
                      </h2>
                      {q && (
                        <p className="mt-1 text-sm text-gray-500">
                          이사 예정 {q.moveDate || '미정'}
                        </p>
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
                    <p className="mt-4 rounded-xl bg-brand-bg px-4 py-3 text-sm leading-relaxed text-gray-600">
                      {b.message}
                    </p>
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

export default PartnerBidsPage
