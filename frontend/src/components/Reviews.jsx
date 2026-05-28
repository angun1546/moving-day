import { Link } from 'react-router-dom'

// 메인 리뷰 섹션 — 가상 리뷰 제거, 빈 상태 + 작성 페이지 진입
function Reviews() {
  return (
    <section
      id="reviews"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20"
    >
      <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        Review
      </p>
      <h2 className="mt-2 text-3xl font-bold text-gray-900">고객 리뷰</h2>
      <p className="mt-3 text-gray-600">
        이삿날을 이용한 고객들의 솔직한 후기를 확인해보세요.
      </p>
      <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-4xl">✍️</p>
        <p className="mt-4 font-semibold text-gray-700">
          아직 등록된 리뷰가 없어요
        </p>
        <p className="mt-1 text-sm text-gray-500">
          이삿날의 첫 리뷰를 남겨주세요. 사진도 함께 올릴 수 있어요.
        </p>
        <Link
          to="/reviews"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          리뷰 작성하기
        </Link>
      </div>
    </section>
  )
}

export default Reviews
