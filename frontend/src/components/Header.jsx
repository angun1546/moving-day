import { Link } from 'react-router-dom'

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

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand">
          <Logo />
          이삿날
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          <a href="#services" className="transition hover:text-brand">
            서비스
          </a>
          <a href="#steps" className="transition hover:text-brand">
            이용 절차
          </a>
          <a href="#reviews" className="transition hover:text-brand">
            고객 후기
          </a>
        </nav>

        <Link
          to="/quote"
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          견적 받기
        </Link>
      </div>
    </header>
  )
}

export default Header
