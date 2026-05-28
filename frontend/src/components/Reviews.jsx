import { Link } from 'react-router-dom'
import ReviewCarousel from './ReviewCarousel'
import { useLocalState } from '../hooks/useLocalState'
import { maskName } from '../utils/userDisplay'

// 메인 리뷰 섹션 — 작성된 리뷰가 있으면 캐러셀, 없으면 빈 상태
function Reviews() {
  const [reviews] = useLocalState('movingday_user_reviews', [])

  // 캐러셀 카드 데이터로 변환 — 메인 노출 시점에 일괄 마스킹(프라이버시 보호)
  const display = reviews.map((r) => ({
    id: r.id,
    name: maskName(r.name),
    rating: r.rating,
    tag: r.moveType || '리뷰',
    text: r.text,
    company: r.company || '',
    date: r.date || '',
  }))

  if (display.length === 0) {
    return (
      <section id="reviews" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
            Review
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">고객 리뷰</h2>
          <p className="mt-3 text-gray-600">
            이삿날을 이용한 고객들의 솔직한 후기를 확인해 보세요.
          </p>
          <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-4xl">✍️</p>
            <p className="mt-4 font-semibold text-gray-700">
              아직 등록된 리뷰가 없어요
            </p>
            <p className="mt-1 text-sm text-gray-500">
              이삿날의 첫 리뷰를 남겨주세요.
            </p>
            <Link
              to="/reviews"
              className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              리뷰 작성하기
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div id="reviews" className="scroll-mt-20">
      <ReviewCarousel
        label="Review"
        title="고객 리뷰"
        description="이삿날을 이용한 고객들의 솔직한 후기를 확인해 보세요."
        reviews={display}
      />
      <div className="mx-auto -mt-10 max-w-6xl px-4 pb-12 text-right">
        <Link
          to="/reviews"
          className="text-sm font-semibold text-brand transition hover:underline"
        >
          내 리뷰 작성하기 →
        </Link>
      </div>
    </div>
  )
}

export default Reviews
