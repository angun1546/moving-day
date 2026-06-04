import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '../context/AuthContext'
import MenuIcon from './MenuIcon'
import BellIcon from './BellIcon'
import UserMenu from './UserMenu'
import MovingTruck from './MovingTruck'
import PageTransition from './PageTransition'
import TopButton from './TopButton'
import { useTapFeedback } from '../hooks/useTapFeedback'

// 하단 메뉴 바 — 파트너 주요 메뉴
const MENU = [
  { to: '/partner/dashboard', label: '견적 요청' },
  { to: '/partner/bids', label: '내 입찰' },
  { to: '/partner/profile', label: '업체 정보' },
  { to: '/partner/story', label: '파트너 스토리' },
  { to: '/partner/faq', label: 'FAQ' },
]

// 상단 줄 보조 링크 (로고 오른쪽) — 회사 소개·공지 (회사 페이지는 고객 사이트와 공유)
const TOP_LINKS = [
  { to: '/about', label: '기업소개' },
  { to: '/culture', label: '기업문화' },
  { to: '/certifications', label: '인증현황' },
  { to: '/partner/notice', label: '공지사항' },
]

// 데스크톱 메뉴 바 링크 — 호버 컬러 스왑 + 하단 라인(활성 시 항상 표시)
function PartnerNavLink({ item }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `group relative py-2 text-lg font-semibold whitespace-nowrap transition-colors ${
          isActive ? 'text-brand' : 'text-gray-700 hover:text-brand'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {item.label}
          <span
            className={`absolute bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-brand transition-transform duration-300 ease-out ${
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}
          />
        </>
      )}
    </NavLink>
  )
}

// 업체(파트너) 전용 레이아웃 — 유저 GNB와 동일한 2단 형식
function PartnerLayout() {
  useTapFeedback() // 전역 버튼·링크 탭 피드백
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const panelRef = useRef(null)

  // 파트너 로고는 무조건 파트너 메인('/partner')만 이동. 같은 페이지면 스크롤 업
  function onLogoClick(e) {
    e.preventDefault()
    close()
    if (pathname === '/partner') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/partner')
    }
  }

  // 모바일 메뉴 패널 부드럽게 펼침/접힘
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

  const panelNavClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2.5 text-lg font-medium transition ${
      isActive
        ? 'bg-brand-bg text-brand'
        : 'text-gray-700 hover:bg-brand-bg hover:text-brand'
    }`

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <header className="sticky top-0 z-50">
        {/* 상단 줄: 로고 + 보조 링크 + 유틸 */}
        <div className="relative z-20 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto flex h-16 max-w-gnb items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            {/* 좌측: 트럭 + 로고 + 보조 링크 */}
            <div className="flex shrink-0 items-center gap-2 lg:gap-5">
              <div className="flex shrink-0 items-center gap-2">
                <MovingTruck />
                <Link
                  to="/partner"
                  onClick={onLogoClick}
                  className="flex shrink-0 items-center gap-2"
                >
                  <img
                    src="/logo-mark.png"
                    alt="무브 마스터 파트너"
                    className="h-10 w-auto"
                  />
                  <span className="hidden text-sm font-bold whitespace-nowrap text-brand xl:inline">
                    무브 마스터 파트너센터
                  </span>
                </Link>
              </div>
              <nav className="hidden items-center gap-4 lg:flex">
                {TOP_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="text-sm font-medium whitespace-nowrap text-gray-500 transition-colors hover:text-brand"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* 우측: 유틸 / CTA */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <Link
                to="/"
                className="hidden rounded-full px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:text-brand md:inline-flex"
              >
                고객 사이트로
              </Link>

              {user ? (
                <UserMenu user={user} logout={logout} />
              ) : (
                <Link
                  to="/login?role=partner"
                  className="hidden rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white sm:inline-flex"
                >
                  로그인/회원가입
                </Link>
              )}

              {/* 알림 */}
              <BellIcon />

              {/* 메인 CTA */}
              <Link
                to="/partner/dashboard"
                className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                입찰하기
              </Link>

              {/* 햄버거 (모바일) */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="메뉴"
                aria-expanded={open}
                className="inline-flex items-center justify-center rounded-lg p-2 text-brand transition hover:bg-brand-bg lg:hidden"
              >
                <MenuIcon open={open} />
              </button>
            </div>
          </div>
        </div>

        {/* 하단 줄: 메뉴 바 (데스크톱) — 좌측 정렬 */}
        <div className="relative z-10 hidden border-b border-white/40 bg-white/70 shadow-sm backdrop-blur-lg lg:block">
          <nav className="mx-auto flex h-24 max-w-gnb items-center gap-4 px-4 sm:px-6 lg:px-8 xl:gap-6">
            {MENU.map((n) => (
              <PartnerNavLink key={n.to} item={n} />
            ))}
          </nav>
        </div>

        {/* 모바일 메뉴 패널 */}
        <div
          ref={panelRef}
          className="invisible h-0 overflow-hidden border-b border-white/40 bg-white/80 shadow-sm backdrop-blur-xl lg:hidden"
        >
          <div
            className="mx-auto max-w-gnb space-y-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6"
            style={{ maxHeight: 'calc(100dvh - 4rem)' }}
          >
            {MENU.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={close}
                className={panelNavClass}
              >
                {n.label}
              </NavLink>
            ))}

            {/* 보조 링크 */}
            <div className="border-t border-gray-100 pt-2">
              {TOP_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={close}
                  className="block rounded-lg px-3 py-2 font-medium text-gray-600 transition hover:bg-brand-bg hover:text-brand"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-2">
              {user ? (
                <div className="space-y-1 md:hidden">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-700">
                    {user.nickname || user.name}님
                  </div>
                  <Link
                    to="/partner/mypage"
                    onClick={close}
                    className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-brand-bg hover:text-brand"
                  >
                    마이페이지
                  </Link>
                  <Link
                    to="/account?role=partner"
                    onClick={close}
                    className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-brand-bg hover:text-brand"
                  >
                    회원정보 수정
                  </Link>
                  <Link
                    to="/partner/profile"
                    onClick={close}
                    className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-brand-bg hover:text-brand"
                  >
                    업체정보 수정
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      close()
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left font-medium text-gray-700 transition hover:bg-brand-bg hover:text-brand"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link
                  to="/login?role=partner"
                  onClick={close}
                  className="block rounded-full bg-brand px-4 py-2 text-center text-sm font-semibold text-white md:hidden"
                >
                  로그인/회원가입
                </Link>
              )}
              <Link
                to="/"
                onClick={close}
                className="mt-2 block rounded-lg px-3 py-2 font-medium text-gray-500 transition hover:bg-brand-bg hover:text-brand"
              >
                고객 사이트로 →
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      {/* 파트너 영역 미니 푸터 */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-gnb px-4 py-4 text-xs text-gray-400 sm:px-6 lg:px-8">
          <p>© 2026 무브 마스터 파트너센터</p>
        </div>
      </footer>
      <TopButton />
    </div>
  )
}

export default PartnerLayout
