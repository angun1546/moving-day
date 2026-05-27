import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { href: '#services', label: '서비스' },
  { href: '#steps', label: '이용 절차' },
  { href: '#reviews', label: '고객 후기' },
]

// 햄버거 ↔ X (GSAP: power2.inOut, 정중앙 회전)
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

// 헤더 로고 (PNG)
function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center">
      <img
        src="/logo-mark.png"
        alt="이삿날 The Moving Day"
        className="h-12 w-auto"
      />
    </Link>
  )
}

function Header() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const panelRef = useRef(null)

  // 메뉴 패널을 부드럽게 펼침/접힘
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    gsap.to(el, {
      height: open ? 'auto' : 0,
      autoAlpha: open ? 1 : 0,
      duration: 0.4,
      ease: 'power2.inOut',
    })
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/60 shadow-sm backdrop-blur-lg">
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

      {/* 메뉴 패널 (항상 렌더 + GSAP로 펼침/접힘) */}
      <div
        ref={panelRef}
        className="invisible h-0 overflow-hidden border-t border-gray-100 bg-white/90 opacity-0 backdrop-blur-lg"
      >
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
    </header>
  )
}

export default Header
