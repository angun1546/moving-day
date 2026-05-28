import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocalState } from '../hooks/useLocalState'
import { todayString } from '../utils/date'
import { maskKoreanNamesInText } from '../utils/userDisplay'

const PAGE_SIZE = 5

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

// 별점 선택 (클릭으로 1~5)
function StarPick({ rating, setRating }) {
  return (
    <div className="mt-1 flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          onClick={() => setRating(n)}
          aria-label={`${n}점`}
          className={`text-2xl transition ${
            n <= rating ? 'text-amber-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

// 관리자용 수정 폼
function EditStoryForm({ review, onSave, onCancel }) {
  const [rating, setRating] = useState(review.rating)
  function submit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const company = fd.get('company')?.toString().trim()
    const text = fd.get('text')?.toString().trim()
    if (!company || !text) return
    onSave({ rating, company, text })
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <span className="text-sm font-semibold text-gray-800">별점</span>
        <StarPick rating={rating} setRating={setRating} />
      </div>
      <label className="block">
        <span className="text-sm font-semibold text-gray-800">업체명</span>
        <input
          type="text"
          name="company"
          required
          defaultValue={review.company}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-gray-800">후기</span>
        <textarea
          name="text"
          rows={3}
          required
          defaultValue={review.text}
          className={inputClass}
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          저장
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
        >
          취소
        </button>
      </div>
    </form>
  )
}

function PartnerStoryPage() {
  const { user, isAdmin } = useAuth()
  // localStorage 영속화 (메인 캐러셀과 공유)
  const [reviews, setReviews] = useLocalState('movingday_partner_stories', [])
  const [rating, setRating] = useState(5)
  const [showForm, setShowForm] = useState(false)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [editingId, setEditingId] = useState(null)

  // 검색 필터 (업체명·내용)
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return reviews
    return reviews.filter(
      (r) =>
        r.company.toLowerCase().includes(s) ||
        r.text.toLowerCase().includes(s),
    )
  }, [reviews, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  function onSearch(e) {
    setQ(e.target.value)
    setPage(1)
  }

  function submit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const company = fd.get('company')?.toString().trim()
    const text = fd.get('text')?.toString().trim()
    if (!company || !text) return
    setReviews((prev) => [
      {
        id: Date.now(),
        company,
        text,
        rating,
        date: todayString(),
        authorEmail: user?.email || '',
      },
      ...prev,
    ])
    e.currentTarget.reset()
    setRating(5)
    setShowForm(false)
    setPage(1)
  }

  // 관리자: 수정/삭제
  function update(id, updates) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    )
    setEditingId(null)
  }
  function remove(id) {
    if (!window.confirm('이 후기를 삭제할까요?')) return
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">파트너 스토리</h1>
      <p className="mt-2 text-gray-600">
        먼저 시작한 파트너들의 솔직한 후기를 확인해보세요.
      </p>

      {/* 후기 작성 폼 (토글) */}
      {showForm && (
        <form
          onSubmit={submit}
          className="mt-6 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">후기 작성</h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-gray-500 hover:text-brand"
            >
              닫기
            </button>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-800">별점</span>
            <StarPick rating={rating} setRating={setRating} />
          </div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">업체명</span>
            <input
              type="text"
              name="company"
              required
              placeholder="예: 한솔이사"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">후기</span>
            <textarea
              name="text"
              rows={4}
              required
              placeholder="무브 마스터를 이용한 경험을 자유롭게 적어주세요."
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            후기 등록
          </button>
        </form>
      )}

      {/* 후기 목록 */}
      <div className="mt-8 space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-3xl">✍️</p>
            <p className="mt-3 font-semibold text-gray-700">
              아직 등록된 후기가 없어요
            </p>
            <p className="mt-1 text-sm text-gray-500">
              아래 “후기 등록” 버튼으로 첫 후기를 남겨주세요.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-3xl">🔍</p>
            <p className="mt-3 font-semibold text-gray-700">
              검색 결과가 없어요
            </p>
            <p className="mt-1 text-sm text-gray-500">
              다른 키워드로 검색해 보세요.
            </p>
          </div>
        ) : (
          pageItems.map((r) => (
            <figure
              key={r.id}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              {editingId === r.id ? (
                <EditStoryForm
                  review={r}
                  onSave={(u) => update(r.id, u)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <span className="text-amber-400">
                    {'★'.repeat(r.rating)}
                    <span className="text-gray-200">
                      {'★'.repeat(5 - r.rating)}
                    </span>
                  </span>
                  <blockquote className="mt-3 leading-relaxed text-gray-700">
                    “{r.text}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-gray-900">
                    {r.company}
                  </figcaption>
                  {r.reply && (
                    <div className="mt-4 rounded-2xl bg-brand-bg p-4">
                      <span className="inline-flex items-center rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">
                        관리자 답변
                      </span>
                      <p className="mt-2 leading-relaxed text-gray-700">
                        {maskKoreanNamesInText(r.reply)}
                      </p>
                    </div>
                  )}
                  {isAdmin && (
                    <div className="mt-3 flex gap-3 border-t border-gray-100 pt-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setEditingId(r.id)}
                        className="font-semibold text-gray-500 hover:text-brand"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(r.id)}
                        className="font-semibold text-red-500 hover:text-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </>
              )}
            </figure>
          ))
        )}
      </div>

      {/* 하단 컨트롤 바: 검색 · 페이지 · 등록 버튼 */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center rounded-full border border-gray-300 bg-white px-3 py-1.5">
          <input
            type="search"
            value={q}
            onChange={onSearch}
            placeholder="후기 검색"
            className="w-40 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        {filtered.length > PAGE_SIZE && (
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`h-8 w-8 rounded-full text-sm font-semibold transition ${
                  n === safePage
                    ? 'bg-brand text-white'
                    : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:text-brand'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          {showForm ? '폼 닫기' : '+ 후기 등록'}
        </button>
      </div>
    </section>
  )
}

export default PartnerStoryPage
