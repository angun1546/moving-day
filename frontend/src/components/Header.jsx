import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '../context/AuthContext'
import MenuIcon from './MenuIcon'
import SearchBox from './SearchBox'
import BellIcon from './BellIcon'

// 햄버거 패널 메뉴 (앵커 + 라우트 혼합)
const NAV = [
  { href: '#services', label: '서비스' },
  { href: '#steps', label: '이용 절차' },
  { href: '#reviews', label: '고객 후기' },
  { to: '/faq', label: 'FAQ' },
]

// 헤더 로고 (PNG)
function Logo({ onClick }) {
  const { pathname } = useLocation()

  // 홈에서 로고를 누르면 이동 대신 맨 위로 부드럽게 스크롤
  function handle(e) {
    onClick?.()
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <Link to="/" onClick={handle} className="flex items-center">
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

  // 메뉴 패널 부드럽게 펼침/접힘
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
          {/* 검색창 (견적 받기 왼쪽) */}
          <SearchBox
            placeholder="이사 서비스 검색"
            className="hidden w-36 py-1.5 md:flex"
          />
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
                className="hidden rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white md:inline-flex"
              >
                로그인/회원가입
              </Link>
              <Link
                to="/partner"
                className="hidden rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-brand hover:text-brand md:inline-flex"
              >
                파트너
              </Link>
            </>
          )}

          {/* 알림 (목업: 동작 추후) */}
          <button
            type="button"
            aria-label="알림"
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
          >
            <BellIcon />
          </button>

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

      {/* 메뉴 패널 */}
      <div
        ref={panelRef}
        className="invisible h-0 overflow-hidden border-t border-gray-100 bg-white/90 opacity-0 backdrop-blur-lg"
      >
        <div className="mx-auto max-w-6xl space-y-1 px-4 py-3">
          <SearchBox
            placeholder="이사 서비스 검색"
            className="mb-2 py-2 md:hidden"
          />
          {NAV.map((n) =>
            n.to ? (
              <Link
                key={n.label}
                to={n.to}
                onClick={close}
                className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-brand-bg hover:text-brand"
              >
                {n.label}
              </Link>
            ) : (
              <a
                key={n.label}
                href={n.href}
                onClick={close}
                className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-brand-bg hover:text-brand"
              >
                {n.label}
              </a>
            ),
          )}

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
              <>
                <Link
                  to="/login"
                  onClick={close}
                  className="block rounded-full bg-brand px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  로그인/회원가입
                </Link>
                <Link
                  to="/partner"
                  onClick={close}
                  className="mt-2 block rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-600"
                >
                  무브 마스터 파트너센터
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
