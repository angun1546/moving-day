import { useRef } from 'react'
import gsap from 'gsap'

// 알림 벨 — 클릭 시 좌우로 딸랑딸랑 흔들림 (유저/파트너 헤더 공용)
function BellIcon({ size = 22 }) {
  const ref = useRef(null)

  function shake() {
    if (!ref.current) return
    gsap.fromTo(
      ref.current,
      { rotate: 0 },
      {
        keyframes: {
          rotate: [-15, 15, -12, 12, -8, 8, -4, 4, 0],
        },
        duration: 0.7,
        ease: 'power2.inOut',
        transformOrigin: '50% 0%',
      },
    )
  }

  return (
    <button
      type="button"
      onClick={shake}
      aria-label="알림"
      className="inline-flex items-center justify-center rounded-lg p-2 text-brand transition hover:bg-brand-bg"
    >
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    </button>
  )
}

export default BellIcon
