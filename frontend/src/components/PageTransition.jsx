import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

// 라우트 전환 시 부드러운 페이드+슬라이드 인 (이전·다음 이동 공통)
// 모든 페이지에 동일 강도로 적용 — App·PartnerLayout 양쪽 Outlet을 감쌈
function PageTransition({ children }) {
  const { pathname } = useLocation()
  const ref = useRef(null)

  useEffect(() => {
    // 페이지 진입 시 스크롤 최상단으로 + fade-in 동시 진행
    window.scrollTo({ top: 0, behavior: 'instant' })
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    )
  }, [pathname])

  return <div ref={ref}>{children}</div>
}

export default PageTransition
