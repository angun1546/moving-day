import { useState } from 'react'

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

function UserReviewPage() {
  const [reviews, setReviews] = useState([]) // 작성된 리뷰 (목업: 세션 내)
  const [rating, setRating] = useState(5)
  const [photos, setPhotos] = useState([]) // 미리보기

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
            placeholder="예: 김O영"
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
                <span className="text-amber-400">
                  {'★'.repeat(r.rating)}
                  <span className="text-gray-200">{'★'.repeat(5 - r.rating)}</span>
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
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default UserReviewPage
