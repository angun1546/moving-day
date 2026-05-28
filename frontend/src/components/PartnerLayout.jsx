import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import gsap from 'gsap'
import MenuIcon from './MenuIcon'
import SearchBox from './SearchBox'
import BellIcon from './BellIcon'
import PageTransition from './PageTransition'

const NAV = [
  { to: '/partner/dashboard', label: '입찰 목록' },
  { to: '/partner/profile', label: '업체 정보' },
  { to: '/partner/story', label: '파트너 스토리' },
  { to: '/partner/faq', label: 'FAQ' },
]

// 업체(파트너) 전용 레이아웃 — 유저 헤더와 동일 패턴(검색·로그인·알림·햄버거)
function PartnerLayout() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const panelRef = useRef(null)

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

  const navClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 font-medium transition ${
      isActive
        ? 'bg-brand-bg text-brand'
        : 'text-gray-700 hover:bg-brand-bg hover:text-brand'
    }`

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link
            to="/partner"
            onClick={close}
            className="flex items-center gap-2"
          >
            <img
              src="/logo-mark.png"
              alt="무브 마스터 파트너"
              className="h-9 w-auto"
            />
            <span className="hidden text-sm font-bold whitespace-nowrap text-brand sm:inline">
              무브 마스터 파트너센터
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <SearchBox
              placeholder="견적 요청 검색"
              className="hidden w-44 py-1.5 md:flex"
            />
            <Link
              to="/login?role=partner"
              className="hidden rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white md:inline-flex"
            >
              로그인/회원가입
            </Link>
            <Link
              to="/"
              className="hidden rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-brand hover:text-brand md:inline-flex"
            >
              고객 사이트로
            </Link>
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
          className="invisible h-0 overflow-hidden border-t border-gray-100 bg-white"
        >
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-3">
            <SearchBox
              placeholder="견적 요청 검색"
              className="mb-2 py-2 md:hidden"
            />
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} onClick={close} className={navClass}>
                {n.label}
              </NavLink>
            ))}
            <Link
              to="/login?role=partner"
              onClick={close}
              className="block rounded-full bg-brand px-4 py-2 text-center text-sm font-semibold text-white md:hidden"
            >
              로그인/회원가입
            </Link>
            <Link
              to="/"
              onClick={close}
              className="block rounded-lg px-3 py-2 font-medium text-gray-500 transition hover:bg-brand-bg hover:text-brand"
            >
              고객 사이트로 →
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  )
}

export default PartnerLayout
