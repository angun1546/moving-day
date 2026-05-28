import { useMemo, useState } from 'react'
import { useLocalState } from '../hooks/useLocalState'
import { maskKoreanNamesInText } from '../utils/userDisplay'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

const won = (n) => n.toLocaleString('ko-KR')

// 매칭/입찰 현황 (목업) — 풀스택 단계에서 API 응답으로 교체
const MATCH_DATA = [
  {
    id: 'r1',
    customer: '김O영',
    moveType: '포장이사',
    from: '서울 마포구',
    to: '경기 고양시',
    moveDate: '2026-06-15',
    bids: [
      { company: '한솔이사', price: 290000 },
      { company: '굿모닝이사', price: 275000 },
      { company: '으뜸이사', price: 305000 },
    ],
    status: '입찰중',
  },
  {
    id: 'r2',
    customer: '이O준',
    moveType: '사무실이사',
    from: '서울 강남구',
    to: '서울 성동구',
    moveDate: '2026-06-20',
    bids: [
      { company: '스마트무빙', price: 540000 },
      { company: '프로무빙', price: 580000 },
      { company: '디딤돌이사', price: 565000 },
      { company: '한솔이사', price: 520000 },
    ],
    status: '매칭완료',
  },
  {
    id: 'r3',
    customer: '박O은',
    moveType: '반포장이사',
    from: '인천 부평구',
    to: '인천 남동구',
    moveDate: '2026-06-18',
    bids: [
      { company: '한솔이사', price: 180000 },
      { company: '굿모닝이사', price: 195000 },
    ],
    status: '입찰중',
  },
]

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="font-inter text-3xl font-bold text-brand">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  )
}

function Empty() {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p className="text-3xl">📭</p>
      <p className="mt-3 font-semibold text-gray-700">데이터가 없습니다</p>
    </div>
  )
}

// 리뷰 카드 — 통합 객체(_kind, type, author, ...) 받아 처리
function ReviewItem({ review, onToggleHide, onRemove, onReply, onClearReply }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [editing, setEditing] = useState(false)
  const [editDraft, setEditDraft] = useState('')

  function save() {
    if (!draft.trim()) return
    onReply(review, draft.trim())
    setDraft('')
    setOpen(false)
  }
  function startEdit() {
    setEditDraft(review.reply || '')
    setEditing(true)
  }
  function saveEdit() {
    if (!editDraft.trim()) return
    onReply(review, editDraft.trim())
    setEditing(false)
  }

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        review.hidden ? 'border-gray-200 opacity-60' : 'border-gray-100'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
              {review.type}
            </span>
            <span className="text-amber-400">
              {'★'.repeat(review.rating)}
              <span className="text-gray-200">
                {'★'.repeat(5 - review.rating)}
              </span>
            </span>
            {review.hidden && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">
                숨김
              </span>
            )}
          </div>
          <p className="mt-2 leading-relaxed text-gray-700">{review.text}</p>
          <p className="mt-2 text-xs text-gray-400">
            {review.author} · {review.createdAt || ''}
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => onToggleHide(review)}
            className="rounded-full border border-gray-300 px-3 py-1.5 font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
          >
            {review.hidden ? '노출' : '숨김'}
          </button>
          <button
            type="button"
            onClick={() => onRemove(review)}
            className="rounded-full border border-red-300 px-3 py-1.5 font-semibold text-red-500 transition hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>

      {/* 관리자 답변 */}
      {review.reply && !editing ? (
        <div className="mt-4 rounded-xl bg-brand-bg p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">
              관리자 답변
            </span>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={startEdit}
                className="font-semibold text-gray-600 hover:text-brand"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => onClearReply(review)}
                className="font-semibold text-red-500 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          </div>
          <p className="mt-2 leading-relaxed text-gray-700">
            {maskKoreanNamesInText(review.reply)}
          </p>
        </div>
      ) : editing ? (
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          <textarea
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            rows={3}
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveEdit}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      ) : open ? (
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="리뷰에 대한 답변을 입력하세요."
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              답변 등록
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 text-sm font-semibold text-brand hover:underline"
        >
          + 답변 작성
        </button>
      )}
    </article>
  )
}

// Q&A 문의 카드 — status는 a 유무로 자동 계산
function InquiryCard({ inquiry, onAnswer, onClear, onRemove }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const status = inquiry.a ? '답변완료' : '대기'

  function save() {
    if (!draft.trim()) return
    onAnswer(inquiry, draft.trim())
    setDraft('')
    setOpen(false)
  }

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
              {inquiry.type}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                status === '답변완료'
                  ? 'bg-brand-light text-brand'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {status}
            </span>
          </div>
          <p className="mt-2 font-medium text-gray-900">Q. {inquiry.q}</p>
          <p className="mt-1 text-xs text-gray-400">{inquiry.author}</p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(inquiry)}
          className="text-xs font-semibold text-red-500 hover:text-red-700"
        >
          삭제
        </button>
      </div>

      {inquiry.a ? (
        <div className="mt-3 rounded-xl bg-brand-bg p-4">
          <p className="text-xs font-bold text-brand">A. 관리자 답변</p>
          <p className="mt-1 leading-relaxed text-gray-700">
            {maskKoreanNamesInText(inquiry.a)}
          </p>
          <button
            type="button"
            onClick={() => onClear(inquiry)}
            className="mt-2 text-xs font-semibold text-gray-500 hover:text-brand"
          >
            답변 지우고 다시 작성
          </button>
        </div>
      ) : open ? (
        <div className="mt-3 space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="답변을 입력하세요."
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              답변 등록
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 text-sm font-semibold text-brand hover:underline"
        >
          + 답변 작성
        </button>
      )}
    </article>
  )
}

function AdminDashboardPage() {
  // 사용자 페이지와 같은 키 공유 — 양방향 동기화
  const [userReviews, setUserReviews] = useLocalState(
    'movingday_user_reviews',
    [],
  )
  const [partnerStories, setPartnerStories] = useLocalState(
    'movingday_partner_stories',
    [],
  )
  const [userQa, setUserQa] = useLocalState('movingday_user_qa', [])
  const [partnerQa, setPartnerQa] = useLocalState('movingday_partner_qa', [])

  // 두 리뷰 큐를 합쳐 admin이 한 화면에서 관리, 시간 역순
  const allReviews = useMemo(() => {
    return [
      ...userReviews.map((r) => ({
        ...r,
        _kind: 'user',
        type: '고객',
        author: r.name,
        createdAt: r.date || '',
      })),
      ...partnerStories.map((r) => ({
        ...r,
        _kind: 'partner',
        type: '파트너',
        author: r.company,
        createdAt: r.date || '',
      })),
    ].sort((a, b) => b.id - a.id)
  }, [userReviews, partnerStories])

  const allInquiries = useMemo(() => {
    return [
      ...userQa.map((q) => ({
        ...q,
        _kind: 'user',
        type: '고객',
        author: q.name,
      })),
      ...partnerQa.map((q) => ({
        ...q,
        _kind: 'partner',
        type: '파트너',
        author: q.name,
      })),
    ].sort((a, b) => b.id - a.id)
  }, [userQa, partnerQa])

  // 통계
  const inProgress = MATCH_DATA.filter((m) => m.status === '입찰중').length
  const totalBids = MATCH_DATA.reduce((sum, m) => sum + m.bids.length, 0)
  const hiddenReviews = allReviews.filter((r) => r.hidden).length
  const pendingQa = allInquiries.filter((i) => !i.a).length

  // 리뷰 액션 — 어느 큐인지 _kind로 분기해 같은 키에 반영
  function toggleHide(item) {
    const updater = (prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, hidden: !r.hidden } : r))
    if (item._kind === 'user') setUserReviews(updater)
    else setPartnerStories(updater)
  }
  function removeReview(item) {
    if (!window.confirm('이 리뷰를 삭제할까요?')) return
    const filter = (prev) => prev.filter((r) => r.id !== item.id)
    if (item._kind === 'user') setUserReviews(filter)
    else setPartnerStories(filter)
  }
  function replyReview(item, text) {
    const updater = (prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, reply: text } : r))
    if (item._kind === 'user') setUserReviews(updater)
    else setPartnerStories(updater)
  }
  function clearReply(item) {
    const updater = (prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, reply: '' } : r))
    if (item._kind === 'user') setUserReviews(updater)
    else setPartnerStories(updater)
  }

  // Q&A 액션
  function answer(item, text) {
    const updater = (prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, a: text } : q))
    if (item._kind === 'user') setUserQa(updater)
    else setPartnerQa(updater)
  }
  function clearAnswer(item) {
    const updater = (prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, a: '' } : q))
    if (item._kind === 'user') setUserQa(updater)
    else setPartnerQa(updater)
  }
  function removeInquiry(item) {
    if (!window.confirm('이 문의를 삭제할까요?')) return
    const filter = (prev) => prev.filter((q) => q.id !== item.id)
    if (item._kind === 'user') setUserQa(filter)
    else setPartnerQa(filter)
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        Admin
      </p>
      <h1 className="mt-1 text-3xl font-bold text-gray-900">관리자 대시보드</h1>
      <p className="mt-2 text-gray-600">
        견적·입찰·리뷰·문의를 한 화면에서 모니터링하고 직접 제어합니다.
      </p>

      {/* 통계 (Bento) */}
      <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="진행 중 견적" value={inProgress} />
        <StatCard label="누적 입찰" value={totalBids} />
        <StatCard label="숨김 리뷰" value={hiddenReviews} />
        <StatCard label="미답변 Q&A" value={pendingQa} />
      </dl>

      {/* ① 매칭/입찰 현황 */}
      <h2 className="mt-12 text-xl font-bold text-gray-900">매칭·입찰 현황</h2>
      <p className="mt-2 text-sm text-gray-500">
        진행 중인 견적 요청과 받은 입찰을 모니터링합니다.
      </p>
      <div className="mt-4 space-y-4">
        {MATCH_DATA.map((m) => (
          <article
            key={m.id}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                    {m.moveType}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      m.status === '매칭완료'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  {m.from} → {m.to}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {m.customer} · 이사 예정 {m.moveDate}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="text-gray-400">입찰 {m.bids.length}건</p>
                {m.bids.length > 0 && (
                  <p className="font-inter font-bold text-brand">
                    최저 {won(Math.min(...m.bids.map((b) => b.price)))}원
                  </p>
                )}
              </div>
            </div>
            {m.bids.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-500">입찰 내역</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {m.bids.map((b, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="text-gray-700">{b.company}</span>
                      <span className="font-inter font-semibold text-gray-900">
                        {won(b.price)}원
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* ② 리뷰 관리 — user/partner 통합 */}
      <h2 className="mt-12 text-xl font-bold text-gray-900">리뷰 관리</h2>
      <p className="mt-2 text-sm text-gray-500">
        사용자/파트너가 작성한 리뷰를 한 곳에서 관리합니다. 답변은 사용자
        페이지에도 즉시 반영됩니다.
      </p>
      <div className="mt-4 space-y-3">
        {allReviews.length === 0 ? (
          <Empty />
        ) : (
          allReviews.map((r) => (
            <ReviewItem
              key={`${r._kind}-${r.id}`}
              review={r}
              onToggleHide={toggleHide}
              onRemove={removeReview}
              onReply={replyReview}
              onClearReply={clearReply}
            />
          ))
        )}
      </div>

      {/* ③ Q&A 답변 — user/partner 통합 */}
      <h2 className="mt-12 text-xl font-bold text-gray-900">Q&A 답변</h2>
      <p className="mt-2 text-sm text-gray-500">
        대기 중인 문의에 답변을 작성하면 답변완료로 전환되고, 사용자 페이지에도
        즉시 반영됩니다.
      </p>
      <div className="mt-4 space-y-3">
        {allInquiries.length === 0 ? (
          <Empty />
        ) : (
          allInquiries.map((i) => (
            <InquiryCard
              key={`${i._kind}-${i.id}`}
              inquiry={i}
              onAnswer={answer}
              onClear={clearAnswer}
              onRemove={removeInquiry}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default AdminDashboardPage
