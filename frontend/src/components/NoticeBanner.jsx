import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { getNotices } from '../services/notices'

// 최근 공지 릴레이 배너 — 헤더 아래·검색창 위. 일정 간격마다 다음 공지로 GSAP 전환
function NoticeBanner() {
  const [notices, setNotices] = useState([])
  const [idx, setIdx] = useState(0)
  const textRef = useRef(null)

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

  // 공지 바뀔 때 페이드+슬라이드
  useEffect(() => {
    if (!textRef.current) return
    gsap.fromTo(
      textRef.current,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
    )
  }, [idx])

  if (!notices.length) return null
  const n = notices[idx]

  return (
    <Link
      to="/notice"
      data-no-lift
      className="mx-auto mb-10 flex max-w-2xl items-center gap-3 rounded-full border border-brand-light bg-white/80 px-5 py-3 shadow-sm backdrop-blur transition hover:border-brand"
    >
      <span className="shrink-0 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white">
        공지
      </span>
      <span
        ref={textRef}
        className="flex-1 truncate text-sm font-medium text-gray-700"
      >
        {n.title}
      </span>
      <span className="shrink-0 text-xs font-semibold text-brand">자세히 →</span>
    </Link>
  )
}

export default NoticeBanner
