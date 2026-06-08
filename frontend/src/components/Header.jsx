import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '../context/AuthContext'
import { homeTypes, businessTypes } from '../data/quoteOptions'
import { cleaningServices } from '../data/cleaning'
import { storageServices } from '../data/storage'
import { documentServices } from '../data/document'
import MenuIcon from './MenuIcon'
import BellIcon from './BellIcon'
import UserMenu from './UserMenu'
import MovingTruck from './MovingTruck'

// 세부 카테고리 → 해당 종류로 견적 바로 열기
const subItems = (scope, types) =>
  types.map((t) => ({ label: t.label, to: `/quote?scope=${scope}&type=${t.slug}` }))

// 하단 메뉴 바 — 주요 서비스 (subs: 호버 시 펼치는 세부 카테고리 / soon: 준비중)
const MENU = [
  { to: '/business', label: '기업·관공서 이사', subs: subItems('business', businessTypes) },
  { to: '/home', label: '가정이사', subs: subItems('home', homeTypes) },
  {
    to: '/cleaning',
    label: '청소',
    subs: cleaningServices.map((c) => ({ label: c.label, to: `/cleaning/${c.slug}` })),
  },
  {
    to: '/document',
    label: '문서보관·파쇄',
    subs: documentServices.map((d) => ({ label: d.label, to: `/document/${d.slug}` })),
  },
  {
    to: '/storage',
    label: '창고보관',
    subs: storageServices.map((s) => ({ label: s.label, to: `/storage/${s.slug}` })),
  },
  { to: '/quote', label: '상담문의' },
  { to: '/reviews', label: '고객 후기' },
  { to: '/faq', label: 'FAQ' },
  {
    to: '/projects',
    label: '무빙 프로젝트',
    subs: [
      { label: '프로젝트 갤러리', to: '/projects/gallery' },
      { label: '포트폴리오', to: '/projects/portfolio' },
      { label: '무빙 브이로그', to: '/projects/vlog' },
    ],
  },
]

// 상단 줄 보조 링크 (로고 오른쪽) — 고객 지원·커뮤니티
const TOP_LINKS = [
  { to: '/complaint', label: '불편사항 접수' },
  { to: '/tips', label: '팁 게시판' },
  { to: '/faq', label: 'FAQ' },
  { to: '/reviews', label: '후기' },
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
      <Link to={homePath} onClick={handle} className="flex shrink-0 items-center gap-2">
        <img src="/logo-mark.png" alt="무브 마스터 파트너" className="h-9 w-auto" />
        <span className="hidden text-sm font-bold whitespace-nowrap text-brand sm:inline">
          무브 마스터 파트너센터
        </span>
      </Link>
    )
  }

  return (
    <Link to={homePath} onClick={handle} className="flex shrink-0 items-center">
      <img
        src="/logo-mark.png"
        alt="이삿날 The Moving Day"
        className="h-10 w-auto sm:h-14"
      />
    </Link>
  )
}

// 하단 라인 슬라이드 인디케이터 (호버 시 좌→우)
function Underline() {
  return (
    <span className="absolute bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-brand transition-transform duration-300 ease-out group-hover:scale-x-100" />
  )
}

// 작은 꺾쇠 (드롭다운 표시)
function Chevron() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M3 4.5 6 7.5 9 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// 데스크톱 내비 아이템 — 호버 시 컬러 스왑 + 하단 라인, subs 있으면 드롭다운
function NavItem({ item }) {
  // 준비중(단독)
  if (item.soon) {
    return (
      <span
        title="준비중"
        className="cursor-not-allowed py-2 text-lg font-semibold whitespace-nowrap text-gray-400"
      >
        {item.label}
      </span>
    )
  }

  // 일반 링크(세부 없음)
  if (!item.subs) {
    return (
      <Link
        to={item.to}
        className="group relative py-2 text-lg font-semibold whitespace-nowrap text-gray-700 transition-colors hover:text-brand"
      >
        {item.label}
        <Underline />
      </Link>
    )
  }

  // 드롭다운 — 트리거는 링크(to 있을 때) 또는 라벨(to 없을 때)
  const triggerClass =
    'group relative flex items-center gap-1.5 py-2 text-lg font-semibold whitespace-nowrap text-gray-700 transition-colors hover:text-brand'
  return (
    <div className="group relative">
      {item.to ? (
        <Link to={item.to} className={triggerClass}>
          {item.label}
          <Chevron />
          <Underline />
        </Link>
      ) : (
        <span className={`${triggerClass} cursor-default`}>
          {item.label}
          <Chevron />
          <Underline />
        </span>
      )}

      {/* 세부 카테고리 패널 — pt-2는 트리거~패널 사이 호버 브리지 */}
      <div className="invisible absolute top-full left-0 z-50 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div className="min-w-52 rounded-2xl border border-white/40 bg-white/70 p-2.5 shadow-lg backdrop-blur-lg">
          {item.subs.map((s) =>
            s.soon ? (
              <span
                key={s.label}
                title="준비중"
                className="flex cursor-not-allowed items-center gap-2 rounded-lg px-4 py-2.5 text-base font-medium whitespace-nowrap text-gray-400"
              >
                {s.label}
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-400">
                  준비중
                </span>
              </span>
            ) : (
              <Link
                key={s.label}
                to={s.to}
                className="block rounded-lg px-4 py-2.5 text-base font-medium text-gray-700 transition hover:bg-brand-bg hover:text-brand"
              >
                {s.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

function Header() {
  const { user, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const panelRef = useRef(null)

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

  return (
    <header className="sticky top-0 z-50">
      {/* 상단 줄: 로고 + 유틸(로그인·알림·CTA) */}
      <div className="relative z-20 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-gnb items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* 좌측: 이사트럭 + 로고 + 보조 링크 */}
          <div className="flex shrink-0 items-center gap-2 lg:gap-5">
            <div className="flex shrink-0 items-center gap-2">
              <MovingTruck />
              <Logo onClick={close} />
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
              to="/partner"
              className="hidden rounded-full px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:text-brand md:inline-flex"
            >
              파트너
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-200 md:inline-flex"
              >
                관리자
              </Link>
            )}

            {user ? (
              <UserMenu user={user} logout={logout} />
            ) : (
              <Link
                to="/login"
                className="hidden rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white sm:inline-flex"
              >
                로그인/회원가입
              </Link>
            )}

            {/* 알림 */}
            <BellIcon />

            {/* 메인 CTA */}
            <Link
              to="/quote"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-dark sm:px-5"
            >
              견적신청
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
            <NavItem key={n.label} item={n} />
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
          {MENU.map((n) => {
            // 준비중(단독)
            if (n.soon) {
              return (
                <div
                  key={n.label}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-lg font-medium text-gray-400"
                >
                  {n.label}
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-400">
                    준비중
                  </span>
                </div>
              )
            }
            // 세부 카테고리 있는 항목 — 부모 + 들여쓴 세부 목록
            if (n.subs) {
              return (
                <div key={n.label}>
                  {n.to ? (
                    <Link
                      to={n.to}
                      onClick={close}
                      className="block rounded-lg px-3 py-2.5 text-lg font-semibold text-gray-900 transition hover:bg-brand-bg hover:text-brand"
                    >
                      {n.label}
                    </Link>
                  ) : (
                    <div className="px-3 py-2.5 text-lg font-semibold text-gray-900">
                      {n.label}
                    </div>
                  )}
                  <div className="mb-1 ml-3 space-y-0.5 border-l border-gray-100 pl-3">
                    {n.subs.map((s) =>
                      s.soon ? (
                        <div
                          key={s.label}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-gray-400"
                        >
                          {s.label}
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-400">
                            준비중
                          </span>
                        </div>
                      ) : (
                        <Link
                          key={s.label}
                          to={s.to}
                          onClick={close}
                          className="block rounded-lg px-3 py-2 text-base font-medium text-gray-600 transition hover:bg-brand-bg hover:text-brand"
                        >
                          {s.label}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              )
            }
            // 일반 링크
            return (
              <Link
                key={n.label}
                to={n.to}
                onClick={close}
                className="block rounded-lg px-3 py-2.5 text-lg font-medium text-gray-700 transition hover:bg-brand-bg hover:text-brand"
              >
                {n.label}
              </Link>
            )
          })}

          {/* 고객 지원·커뮤니티 (불편사항·팁·FAQ·후기·공지) */}
          <div className="border-t border-gray-100 pt-2">
            <p className="px-3 pb-1 text-xs font-semibold text-gray-400">
              고객 지원
            </p>
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

            {/* 파트너 / 관리자 */}
            <Link
              to="/partner"
              onClick={close}
              className="mt-2 block rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-600"
            >
              무브 마스터 파트너센터
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={close}
                className="mt-2 block rounded-full bg-amber-100 px-4 py-2 text-center text-sm font-bold text-amber-700"
              >
                관리자
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
