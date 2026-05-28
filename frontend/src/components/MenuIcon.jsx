import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// 햄버거 ↔ X (GSAP: power2.inOut, 정중앙 회전) — 유저/파트너 헤더 공용
function MenuIcon({ open }) {
  const top = useRef(null)
  const mid = useRef(null)
  const bot = useRef(null)

  useEffect(() => {
    const o = { duration: 0.4, ease: 'power2.inOut', transformOrigin: '50% 50%' }
    if (open) {
      gsap.to(top.current, { y: 5, rotate: 45, ...o })
      gsap.to(mid.current, { autoAlpha: 0, ...o })
      gsap.to(bot.current, { y: -5, rotate: -45, ...o })
    } else {
      gsap.to(top.current, { y: 0, rotate: 0, ...o })
      gsap.to(mid.current, { autoAlpha: 1, ...o })
      gsap.to(bot.current, { y: 0, rotate: 0, ...o })
    }
  }, [open])

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line ref={top} x1="4" y1="7" x2="20" y2="7" />
      <line ref={mid} x1="4" y1="12" x2="20" y2="12" />
      <line ref={bot} x1="4" y1="17" x2="20" y2="17" />
    </svg>
  )
}

export default MenuIcon
