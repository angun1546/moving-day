import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { getNotices } from '../services/notices'
import type { Notice } from '../data/apiTypes'

// 최근 공지 바 — GNB 바로 아래 가로 꽉 찬 띠. 여러 공지를 일정 간격으로 순환(GSAP), X로 닫기
// 닫기는 일시적(상태로만) — 새로고침하면 다시 노출
function NoticeBanner() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [idx, setIdx] = useState(0)
  const [closed, setClosed] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)
  const first = useRef(true)

  useEffect(() => {
    getNotices()
      .then((d) => setNotices(Array.isArray(d) ? d.slice(0, 5) : []))
      .catch(() => setNotices([]))
  }, [])

  // 릴레이 — 공지가 2개 이상이면 일정 간격으로 순환
  useEffect(() => {
    if (notices.length <= 1) return
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % notices.length)
    }, 3500)
    return () => clearInterval(t)
  }, [notices])

  // 첫 표시는 즉시(딜레이 없음), 이후 릴레이 전환만 페이드+슬라이드
  useEffect(() => {
    if (!textRef.current) return
    if (first.current) {
      first.current = false
      return
    }
    gsap.fromTo(
      textRef.current,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
    )
  }, [idx])

  if (!notices.length || closed) return null
  const n = notices[idx]

  return (
    <div className="bg-brand-dark">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-brand">
          공지
        </span>
        <Link
          to="/notice"
          data-no-lift
          className="flex min-w-0 flex-1 items-center gap-2"
        >
          <span
            ref={textRef}
            className="truncate text-sm font-medium text-white"
          >
            {n.title}
          </span>
          <span className="hidden shrink-0 text-xs font-semibold text-white/80 sm:inline">
            자세히 →
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="공지 닫기"
          className="shrink-0 rounded-full p-2 text-white/70 transition hover:bg-white/20 hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default NoticeBanner
