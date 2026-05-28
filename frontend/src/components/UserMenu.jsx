import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'

// 로그인 시 사용자 메뉴 — 닉네임/이름 클릭 → 마이페이지·회원정보 수정·로그아웃 (유저/파트너 헤더 공용)
function UserMenu({ user, logout }) {
  const { pathname } = useLocation()
  // 파트너 영역에서 진입하면 파트너 마이페이지로 분기
  const myPagePath = pathname.startsWith('/partner')
    ? '/partner/mypage'
    : '/mypage'
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const dropdownRef = useRef(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  // 드롭다운 부드러운 페이드+슬라이드 (open 토글마다 양방향 애니메이션)
  useEffect(() => {
    const el = dropdownRef.current
    if (!el) return
    if (open) {
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
      })
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        y: -8,
        duration: 0.2,
        ease: 'power2.in',
      })
    }
  }, [open])

  const itemClass =
    'block w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-brand-bg hover:text-brand'

  return (
    <div ref={ref} className="relative hidden md:inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-brand hover:text-brand"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.nickname || user.name}님 ▾
      </button>
      <div
        ref={dropdownRef}
        className="invisible absolute right-0 top-full z-50 mt-2 w-44 rounded-2xl border border-gray-100 bg-white py-2 opacity-0 shadow-lg"
      >
        <Link
          to={myPagePath}
          onClick={() => setOpen(false)}
          className={itemClass}
        >
          마이페이지
        </Link>
        <Link to="/account" onClick={() => setOpen(false)} className={itemClass}>
          회원정보 수정
        </Link>
        <button
          type="button"
          onClick={() => {
            logout()
            setOpen(false)
          }}
          className={itemClass}
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default UserMenu
