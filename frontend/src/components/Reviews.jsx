const REVIEWS = [
  {
    name: '김О영',
    tag: '포장이사',
    rating: 5,
    text: '견적 비교가 정말 편했어요. 가격도 투명하고 기사님도 친절하셨습니다.',
  },
  {
    name: '이О준',
    tag: '사무실 이사',
    rating: 5,
    text: '주말 사이에 사무실 이전을 끝냈어요. 업무 공백이 거의 없었습니다.',
  },
  {
    name: '박О은',
    tag: '반포장이사',
    rating: 4,
    text: '필요한 짐만 포장해 주셔서 비용을 많이 아꼈어요. 추천합니다.',
  },
]

function Stars({ rating }) {
  return (
    <span className="text-amber-400" aria-label={`별점 ${rating}점`}>
      {'★'.repeat(rating)}
      <span className="text-gray-200">{'★'.repeat(5 - rating)}</span>
    </span>
  )
}

function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-3xl font-bold text-gray-900">먼저 경험한 고객들의 이야기</h2>
      <p className="mt-3 text-gray-600">이삿날과 함께한 실제 고객 후기입니다.</p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure
            key={r.name}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <Stars rating={r.rating} />
            <blockquote className="mt-4 leading-relaxed text-gray-700">
              “{r.text}”
            </blockquote>
            <figcaption className="mt-5 text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{r.name}</span> · {r.tag}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default Reviews
