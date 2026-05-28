import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getDisplayName } from '../utils/userDisplay'
import { useLocalState } from '../hooks/useLocalState'
import { todayString } from '../utils/date'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

const fileClass =
  'block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand-light/70'

// 이사 종류 (리뷰 카드 tag로 사용)
const MOVE_TYPES = [
  '포장이사',
  '반포장이사',
  '일반이사',
  '사무실이사',
  '원룸이사',
  '프리미엄이사',
]

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
function EditReviewForm({ review, onSave, onCancel }) {
  const [rating, setRating] = useState(review.rating)
  function submit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = fd.get('name')?.toString().trim()
    const text = fd.get('text')?.toString().trim()
    const company = fd.get('company')?.toString().trim()
    if (!name || !text) return
    onSave({ rating, name, text, company })
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <span className="text-sm font-semibold text-gray-800">별점</span>
        <StarPick rating={rating} setRating={setRating} />
      </div>
      <label className="block">
        <span className="text-sm font-semibold text-gray-800">이름</span>
        <input
          type="text"
          name="name"
          required
          defaultValue={review.name}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-gray-800">이용 업체</span>
        <input
          type="text"
          name="company"
          defaultValue={review.company || ''}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-gray-800">내용</span>
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

function UserReviewPage() {
  const { user, isAdmin } = useAuth()
  // localStorage에 영속화 (메인 캐러셀과 공유) — 텍스트 데이터만
  const [reviews, setReviews] = useLocalState('movingday_user_reviews', [])
  const [rating, setRating] = useState(5)
  const [editingId, setEditingId] = useState(null)
  // 로그인 사용자면 표시명 자동 채움 (실명 모드면 마스킹된 형태)
  const [authorName, setAuthorName] = useState('')
  useEffect(() => {
    if (user) setAuthorName(getDisplayName(user))
  }, [user])

  // 사진은 메모리 전용 — 새 사진 선택·언마운트 시 revoke로 누수 차단, localStorage 저장 X
  const [photos, setPhotos] = useState([])
  const [photosMap, setPhotosMap] = useState({}) // 등록된 리뷰 id → photos[]
  const photosRef = useRef([])
  photosRef.current = photos
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [])

  function onPhotos(e) {
    // 이전 미리보기 URL revoke
    photos.forEach((p) => URL.revokeObjectURL(p.url))
    const files = Array.from(e.target.files ?? []).slice(0, 5)
    setPhotos(files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })))
  }

  function submit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = (user ? authorName : fd.get('name')?.toString().trim()) || ''
    const text = fd.get('text')?.toString().trim()
    const moveType = fd.get('moveType')?.toString() || MOVE_TYPES[0]
    const company = fd.get('company')?.toString().trim() || ''
    if (!name || !text) return
    const id = Date.now()
    setReviews((prev) => [
      { id, name, text, rating, moveType, company, date: todayString() },
      ...prev,
    ])
    // 사진은 메모리 맵에만 저장 (localStorage 용량/직렬화 회피)
    if (photos.length > 0) {
      setPhotosMap((prev) => ({ ...prev, [id]: photos }))
    }
    e.currentTarget.reset()
    setRating(5)
    setPhotos([])
    if (!user) setAuthorName('')
  }

  // 관리자: 수정/삭제
  function update(id, updates) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    )
    setEditingId(null)
  }
  function remove(id) {
    if (!window.confirm('이 리뷰를 삭제할까요?')) return
    setReviews((prev) => prev.filter((r) => r.id !== id))
    // 메모리 사진도 정리
    const stored = photosMap[id]
    if (stored) {
      stored.forEach((p) => URL.revokeObjectURL(p.url))
      setPhotosMap((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">고객 리뷰</h1>
      <p className="mt-3 text-gray-600">
        이삿날과 함께한 경험을 자유롭게 남겨주세요.
      </p>

      {/* 작성 폼 */}
      <form
        onSubmit={submit}
        className="mt-8 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <div>
          <span className="text-sm font-semibold text-gray-800">별점</span>
          <StarPick rating={rating} setRating={setRating} />
        </div>
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">
            이름 또는 닉네임
          </span>
          <input
            type="text"
            name="name"
            required
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            readOnly={!!user}
            placeholder="예: 김O영"
            className={`${inputClass} ${user ? 'cursor-default bg-gray-50' : ''}`}
          />
          {user && (
            <p className="mt-1 text-xs text-gray-400">
              회원정보의 표시 방식에 따라 자동 입력됩니다.
            </p>
          )}
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">이사 종류</span>
          <select
            name="moveType"
            defaultValue={MOVE_TYPES[0]}
            className={inputClass}
          >
            {MOVE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">
            이용 업체
            <span className="font-normal text-gray-400"> (선택)</span>
          </span>
          <input
            type="text"
            name="company"
            placeholder="예: 한솔이사"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">리뷰 내용</span>
          <textarea
            name="text"
            rows={4}
            required
            placeholder="이삿날을 이용한 경험을 솔직하게 적어주세요."
            className={inputClass}
          />
        </label>
        {/* 사진 첨부 (선택) — 메모리에만 보관, 새로고침 시 사진만 사라짐 */}
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">
            사진 첨부
            <span className="font-normal text-gray-400"> (선택, 최대 5장)</span>
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onPhotos}
            className={`${fileClass} mt-1`}
          />
          {photos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {photos.map((p) => (
                <img
                  key={p.url}
                  src={p.url}
                  alt={p.name}
                  className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                />
              ))}
            </div>
          )}
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          리뷰 등록
        </button>
      </form>

      {/* 등록된 리뷰 목록 */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-900">
          등록된 리뷰 {reviews.length > 0 && `(${reviews.length})`}
        </h2>
        {reviews.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-3xl">✍️</p>
            <p className="mt-3 font-semibold text-gray-700">
              아직 등록된 리뷰가 없어요
            </p>
            <p className="mt-1 text-sm text-gray-500">
              위에서 첫 리뷰를 남겨보세요.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {reviews.map((r) => (
              <figure
                key={r.id}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                {editingId === r.id ? (
                  <EditReviewForm
                    review={r}
                    onSave={(u) => update(r.id, u)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      {r.moveType && (
                        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                          {r.moveType}
                        </span>
                      )}
                      <span className="text-amber-400">
                        {'★'.repeat(r.rating)}
                        <span className="text-gray-200">
                          {'★'.repeat(5 - r.rating)}
                        </span>
                      </span>
                    </div>
                    <blockquote className="mt-3 leading-relaxed text-gray-700">
                      “{r.text}”
                    </blockquote>
                    {photosMap[r.id] && photosMap[r.id].length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {photosMap[r.id].map((p) => (
                          <img
                            key={p.url}
                            src={p.url}
                            alt={p.name}
                            className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                          />
                        ))}
                      </div>
                    )}
                    {r.company && (
                      <p className="mt-3 text-xs text-gray-500">
                        이용 업체:{' '}
                        <span className="font-semibold text-gray-700">
                          {r.company}
                        </span>
                      </p>
                    )}
                    <figcaption className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-900">{r.name}</span>
                      {r.date && (
                        <span className="font-inter text-gray-400">{r.date}</span>
                      )}
                    </figcaption>
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
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default UserReviewPage
