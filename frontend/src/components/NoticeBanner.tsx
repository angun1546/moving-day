import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { getNotices } from '../services/notices'
import type { Notice } from '../data/apiTypes'

// 닫은 공지 id 저장 — 새 공지(최신 id 변경)가 오면 다시 노출
const DISMISS_KEY = 'movingday_notice_dismissed'

// 최근 공지 바 — GNB 바로 아래 가로 꽉 찬 띠. 여러 공지를 일정 간격으로 순환(GSAP), X로 닫기
function NoticeBanner() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [idx, setIdx] = useState(0)
  // 마운트 시 1회만 읽어 깜빡임 방지
  const [dismissedId, setDismissedId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(DISMISS_KEY)
    } catch {
      return null
    }
  })
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

  // 가장 최근 공지 id를 기준으로 닫힘 판정
  const latestId = notices[0]?.id
  const closed = !!latestId && dismissedId === latestId

  function close() {
    if (!latestId) return
    setDismissedId(latestId)
    try {
      localStorage.setItem(DISMISS_KEY, latestId)
    } catch {
      // 저장 실패 무시
    }
  }

  if (!notices.length || closed) return null
  const n = notices[idx]

  return (
    <div className="border-b border-brand-light bg-brand-light/50">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <span className="shrink-0 rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">
          공지
        </span>
        <Link
          to="/notice"
          data-no-lift
          className="flex min-w-0 flex-1 items-center gap-2"
        >
          <span
            ref={textRef}
            className="truncate text-sm font-medium text-brand-dark"
          >
            {n.title}
          </span>
          <span className="hidden shrink-0 text-xs font-semibold text-brand sm:inline">
            자세히 →
          </span>
        </Link>
        <button
          type="button"
          onClick={close}
          aria-label="공지 닫기"
          className="shrink-0 rounded-full p-1 text-brand-dark/50 transition hover:bg-white/70 hover:text-brand-dark"
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
