import { useState } from 'react'
import { Link } from 'react-router-dom'

const NAV = [
  { href: '#services', label: '서비스' },
  { href: '#steps', label: '이용 절차' },
  { href: '#reviews', label: '고객 후기' },
]

// 브랜드 로고 마크 (파비콘과 동일한 트럭)
function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="currentColor" />
      <path d="M5 12h12v9H5z" fill="#fff" />
      <path d="M17 14h5l3 3v4h-8z" fill="#9fd9c8" />
      <circle cx="10" cy="22" r="2.2" fill="#1b4d3e" />
      <circle cx="21" cy="22" r="2.2" fill="#1b4d3e" />
    </svg>
  )
}

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

function Header() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          onClick={close}
          className="flex items-center gap-2 text-xl font-bold text-brand"
        >
          <Logo />
          이삿날
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/quote"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            견적 받기
          </Link>
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
            {/* 데스크톱은 상단에 로그인/회원가입이 이미 있으므로 모바일에서만 노출 */}
            <div className="flex gap-2 pt-2 md:hidden">
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
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
