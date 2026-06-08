import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// 캐러셀이 표시하는 리뷰 1건(Reviews.tsx의 display 가공 결과)
interface CarouselReview {
  id: string
  name: string
  rating: number
  tag: string
  text: string
  company: string
  date: string
}

// 별점 표시 (소수점 미지원, 1~5 정수)
function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400" aria-label={`별점 ${rating}점`}>
      {'★'.repeat(rating)}
      <span className="text-gray-200">{'★'.repeat(5 - rating)}</span>
    </span>
  )
}

// 화살표 버튼 (좌/우 chevron SVG)
function ArrowBtn({
  dir,
  disabled,
  onClick,
}: {
  dir: number
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir < 0 ? '이전' : '다음'}
      className={`flex h-10 w-10 items-center justify-center rounded-full border bg-white transition ${
        disabled
          ? 'cursor-not-allowed border-gray-200 text-gray-300'
          : 'border-gray-300 text-gray-700 shadow-sm hover:-translate-y-0.5 hover:border-brand hover:text-brand'
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dir < 0 ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </button>
  )
}

// 리뷰 카드
function ReviewCard({ review }: { review: CarouselReview }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
          {review.tag}
        </span>
        <Stars rating={review.rating} />
      </div>
      <blockquote className="mt-4 flex-1 leading-relaxed text-gray-700">
        “{review.text}”
      </blockquote>
      {review.company && (
        <p className="mt-3 text-xs text-gray-500">
          이용 업체:{' '}
          <span className="font-semibold text-gray-700">{review.company}</span>
        </p>
      )}
      <figcaption className="mt-5 flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-900">{review.name}</span>
        <span className="font-inter text-gray-400">{review.date}</span>
      </figcaption>
    </article>
  )
}

// 고객 리뷰 캐러셀 — 데스크톱 3개 / 태블릿 2개 / 모바일 1개 표시, 화살표 + 터치 스와이프
// viewAllPath 전달 시 헤더 우측에 "전체 보기 →" 링크 노출
function ReviewCarousel({
  label = 'Review',
  title,
  description,
  reviews,
  background = 'plain',
  viewAllPath,
}: {
  label?: string
  title: string
  description?: string
  reviews: CarouselReview[]
  background?: string
  viewAllPath?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  // 스크롤 위치에 따라 화살표 비활성 상태 갱신
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    function check() {
      const t = trackRef.current
      if (!t) return
      setAtStart(t.scrollLeft <= 1)
      setAtEnd(t.scrollLeft + t.clientWidth >= t.scrollWidth - 1)
    }
    check()
    track.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      track.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [reviews])

  // 카드 한 장 너비만큼 부드럽게 이동
  function scroll(dir: number) {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild as HTMLElement | null
    if (!card) return
    track.scrollBy({ left: dir * card.offsetWidth, behavior: 'smooth' })
  }

  const sectionBg =
    background === 'gradient'
      ? 'bg-gradient-to-b from-brand-bg/40 to-transparent'
      : ''

  return (
    <section className={sectionBg}>
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
              {label}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">{title}</h2>
            {description && (
              <p className="mt-3 text-gray-600">{description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {viewAllPath && (
              <Link
                to={viewAllPath}
                className="text-sm font-semibold text-brand transition hover:underline"
                aria-label="전체 보기"
              >
                전체 보기 →
              </Link>
            )}
            <div className="flex gap-2">
              <ArrowBtn dir={-1} disabled={atStart} onClick={() => scroll(-1)} />
              <ArrowBtn dir={1} disabled={atEnd} onClick={() => scroll(1)} />
            </div>
          </div>
        </div>

        {/* 트랙: 모바일 1개 / 태블릿 2개 / 데스크톱 3개. 터치 스와이프는 overflow-x-auto가 자동 처리 */}
        <div
          ref={trackRef}
          className="-mx-2 mt-8 flex snap-x snap-mandatory scroll-smooth overflow-x-auto pb-4"
        >
          {reviews.map((r) => (
            <div
              key={r.id}
              className="w-full shrink-0 snap-start px-2 sm:w-1/2 lg:w-1/3"
            >
              <ReviewCard review={r} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReviewCarousel
