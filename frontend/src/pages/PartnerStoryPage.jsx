import { useState } from 'react'

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

function PartnerStoryPage() {
  const [reviews, setReviews] = useState([]) // 작성된 후기 (목업: 세션 내 유지)
  const [rating, setRating] = useState(5)

  function submit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const company = fd.get('company')?.toString().trim()
    const text = fd.get('text')?.toString().trim()
    if (!company || !text) return
    setReviews((prev) => [{ id: Date.now(), company, text, rating }, ...prev])
    e.currentTarget.reset()
    setRating(5)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">파트너 스토리</h1>
      <p className="mt-2 text-gray-600">
        무브 마스터와 함께한 경험과 후기를 남겨주세요. 다른 파트너에게 큰 힘이
        됩니다.
      </p>

      {/* 후기 작성 폼 */}
      <form
        onSubmit={submit}
        className="mt-8 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
      >
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

      {/* 등록된 후기 목록 */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-900">
          등록된 후기 {reviews.length > 0 && `(${reviews.length})`}
        </h2>
        {reviews.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-3xl">✍️</p>
            <p className="mt-3 font-semibold text-gray-700">
              아직 등록된 후기가 없어요
            </p>
            <p className="mt-1 text-sm text-gray-500">
              위에서 첫 후기를 남겨보세요.
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
                <figcaption className="mt-4 text-sm font-semibold text-gray-900">
                  {r.company}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PartnerStoryPage
