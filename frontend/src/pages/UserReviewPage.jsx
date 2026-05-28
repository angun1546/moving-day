import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getDisplayName } from '../utils/userDisplay'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

const fileClass =
  'block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand-light/70'

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

// 관리자용 수정 폼 (별점/이름/내용만 수정 — 사진은 그대로 유지)
function EditReviewForm({ review, onSave, onCancel }) {
  const [rating, setRating] = useState(review.rating)
  function submit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = fd.get('name')?.toString().trim()
    const text = fd.get('text')?.toString().trim()
    if (!name || !text) return
    onSave({ rating, name, text })
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
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [photos, setPhotos] = useState([])
  const [editingId, setEditingId] = useState(null)
  // 로그인 사용자면 표시명을 자동 채움 (프라이버시: 실명 모드면 마스킹된 형태)
  const [authorName, setAuthorName] = useState('')
  useEffect(() => {
    if (user) setAuthorName(getDisplayName(user))
  }, [user])

  function onPhotos(e) {
    const files = Array.from(e.target.files ?? []).slice(0, 5)
    setPhotos(files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })))
  }

  function submit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = fd.get('name')?.toString().trim()
    const text = fd.get('text')?.toString().trim()
    if (!name || !text) return
    setReviews((prev) => [
      { id: Date.now(), name, text, rating, photos },
      ...prev,
    ])
    e.currentTarget.reset()
    setRating(5)
    setPhotos([])
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
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">고객 리뷰</h1>
      <p className="mt-3 text-gray-600">
        이삿날과 함께한 경험을 자유롭게 남겨주세요. 사진도 함께 올릴 수 있어요.
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
          <span className="text-sm font-semibold text-gray-800">리뷰 내용</span>
          <textarea
            name="text"
            rows={4}
            required
            placeholder="이삿날을 이용한 경험을 솔직하게 적어주세요."
            className={inputClass}
          />
        </label>
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
                    <span className="text-amber-400">
                      {'★'.repeat(r.rating)}
                      <span className="text-gray-200">
                        {'★'.repeat(5 - r.rating)}
                      </span>
                    </span>
                    <blockquote className="mt-3 leading-relaxed text-gray-700">
                      “{r.text}”
                    </blockquote>
                    {r.photos && r.photos.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {r.photos.map((p) => (
                          <img
                            key={p.url}
                            src={p.url}
                            alt={p.name}
                            className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                          />
                        ))}
                      </div>
                    )}
                    <figcaption className="mt-4 text-sm font-semibold text-gray-900">
                      {r.name}
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
