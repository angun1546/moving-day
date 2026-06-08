import { useEffect, useState } from 'react'

// 우하단 고정 TOP 버튼 — 일정 스크롤 이상에서 노출, 클릭 시 부드럽게 최상단으로
function TopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    function check() {
      setShow(window.scrollY > 300)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  function toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="맨 위로"
      className={`fixed right-4 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-brand-dark sm:right-6 ${
        show ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}

export default TopButton
