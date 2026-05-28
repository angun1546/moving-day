import { Link } from 'react-router-dom'
import ReviewCarousel from './ReviewCarousel'
import { USER_REVIEWS } from '../data/sampleReviews'

// 메인 리뷰 섹션 — 캐러셀 + 작성 페이지 진입 CTA
function Reviews() {
  return (
    <div id="reviews" className="scroll-mt-20">
      <ReviewCarousel
        label="Review"
        title="고객 리뷰"
        description="이삿날을 이용한 고객들의 솔직한 후기를 확인해 보세요."
        reviews={USER_REVIEWS}
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
