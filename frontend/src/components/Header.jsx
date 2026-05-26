import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { href: '#services', label: '서비스' },
  { href: '#steps', label: '이용 절차' },
  { href: '#reviews', label: '고객 후기' },
]

// 햄버거 / 닫기 아이콘
function MenuIcon({ open }) {
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
      {open ? (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </>
      ) : (
        <>
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </>
      )}
    </svg>
  )
}

// 트럭이 사각형에서 나와 글자를 치고 갔다가 돌아오는 로고
function Logo({ onClick }) {
  const rootRef = useRef(null)
  const textRef = useRef(null)
  const truckRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const truck = truckRef.current
    const text = textRef.current
    if (!root || !truck || !text) return

    // 트럭 세로 중앙 정렬 (transform은 GSAP이 관리)
    gsap.set(truck, { yPercent: -50 })

    let busy = false
    const play = () => {
      if (busy) return
      busy = true
      const distance = root.clientWidth - 30 // 로고 오른쪽 끝까지
      gsap
        .timeline({ onComplete: () => (busy = false) })
        .to(truck, { x: distance, duration: 0.7, ease: 'power2.in' })
        .to(text, { x: 4, duration: 0.07, repeat: 1, yoyo: true }, '-=0.1') // 글자 치임
        .to(truck, { x: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.1')
    }

    root.addEventListener('mouseenter', play)
    return () => root.removeEventListener('mouseenter', play)
  }, [])

  return (
    <Link
      ref={rootRef}
      to="/"
      onClick={onClick}
      className="relative flex items-center gap-2 text-xl font-bold text-brand"
    >
      <span className="h-7 w-7 rounded-lg bg-brand" aria-hidden="true" />
      <span ref={textRef}>이삿날</span>
      <svg
        ref={truckRef}
        viewBox="0 0 32 32"
        className="pointer-events-none absolute top-1/2 left-0 h-7 w-7"
        aria-hidden="true"
      >
        <path d="M5 12h12v9H5z" fill="#fff" />
        <path d="M17 14h5l3 3v4h-8z" fill="#9fd9c8" />
        <circle cx="10" cy="22" r="2.2" fill="#1b4d3e" />
        <circle cx="21" cy="22" r="2.2" fill="#1b4d3e" />
      </svg>
    </Link>
  )
}

function Header() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo onClick={close} />

        <div className="flex items-center gap-2">
          <Link
            to="/quote"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            견적 받기
          </Link>

          {user ? (
            <>
              <span className="hidden text-sm font-medium text-gray-700 md:inline">
                {user.name}님
              </span>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-brand hover:text-brand md:inline-flex"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition hover:text-brand md:inline-flex"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white md:inline-flex"
              >
                회원가입
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="메뉴"
            aria-expanded={open}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-3">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={close}
                className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-brand-bg hover:text-brand"
              >
                {n.label}
              </a>
            ))}

            <div className="pt-2 md:hidden">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="px-3 text-sm font-medium text-gray-700">
                    {user.name}님
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      close()
                    }}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={close}
                    className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/signup"
                    onClick={close}
                    className="flex-1 rounded-full bg-brand px-4 py-2 text-center text-sm font-semibold text-white"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
