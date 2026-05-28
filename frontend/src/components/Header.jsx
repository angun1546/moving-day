import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '../context/AuthContext'
import MenuIcon from './MenuIcon'
import SearchBox from './SearchBox'
import BellIcon from './BellIcon'
import UserMenu from './UserMenu'

// 햄버거 패널 메뉴 (앵커 + 라우트 혼합)
const NAV = [
  { href: '#services', label: '서비스' },
  { href: '#steps', label: '이용 절차' },
  { href: '#reviews', label: '고객 후기' },
  { to: '/faq', label: 'FAQ' },
  { to: '/notice', label: '공지사항' },
]

// 헤더 로고 (PNG) — 자기 사이트 메인으로만 이동, 같은 페이지면 스크롤 업
// ?role=partner로 진입한 경우(파트너에서 로그인/회원가입 들어옴): 경로·로고 모두 파트너 스타일로
function Logo({ onClick }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isPartner = params.get('role') === 'partner'
  const homePath = isPartner ? '/partner' : '/'

  function handle(e) {
    e.preventDefault()
    onClick?.()
    if (pathname === homePath) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(homePath)
    }
  }

  if (isPartner) {
    return (
      <Link to={homePath} onClick={handle} className="flex items-center gap-2">
        <img
          src="/logo-mark.png"
          alt="무브 마스터 파트너"
          className="h-9 w-auto"
        />
        <span className="hidden text-sm font-bold whitespace-nowrap text-brand sm:inline">
          무브 마스터 파트너센터
        </span>
      </Link>
    )
  }

  return (
    <Link to={homePath} onClick={handle} className="flex items-center">
      <img
        src="/logo-mark.png"
        alt="이삿날 The Moving Day"
        className="h-12 w-auto"
      />
    </Link>
  )
}

function Header() {
  const { user, isAdmin, logout } = useAuth()
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
    <header className="sticky top-0 z-50 rounded-b-2xl border-b border-white/30 bg-white/60 shadow-sm backdrop-blur-lg">
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
            <UserMenu user={user} logout={logout} />
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white md:inline-flex"
            >
              로그인/회원가입
            </Link>
          )}
          {/* 파트너 진입 (로그인 여부와 무관하게 항상 표시) */}
          <Link
            to="/partner"
            className="hidden rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-brand hover:text-brand md:inline-flex"
          >
            파트너
          </Link>
          {/* 관리자 진입 (admin 로그인 시에만) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-200 md:inline-flex"
            >
              관리자
            </Link>
          )}

          {/* 알림 (클릭 시 딸랑딸랑 흔들림) */}
          <BellIcon />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="메뉴"
            aria-expanded={open}
            className="inline-flex items-center justify-center rounded-lg p-2 text-brand transition hover:bg-brand-bg"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {/* 메뉴 패널 */}
      <div
        ref={panelRef}
        className="invisible h-0 overflow-hidden rounded-b-2xl border-t border-white/30 bg-white/60 opacity-0 shadow-sm backdrop-blur-xl"
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
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-semibold text-gray-700">
                  {user.nickname || user.name}님
                </div>
                <Link
                  to="/mypage"
                  onClick={close}
                  className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-brand-bg hover:text-brand"
                >
                  마이페이지
                </Link>
                <Link
                  to="/account"
                  onClick={close}
                  className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-brand-bg hover:text-brand"
                >
                  회원정보 수정
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
                to="/login"
                onClick={close}
                className="block rounded-full bg-brand px-4 py-2 text-center text-sm font-semibold text-white"
              >
                로그인/회원가입
              </Link>
            )}
            {/* 파트너 진입 (로그인 여부와 무관) */}
            <Link
              to="/partner"
              onClick={close}
              className="mt-2 block rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-600"
            >
              무브 마스터 파트너센터
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
