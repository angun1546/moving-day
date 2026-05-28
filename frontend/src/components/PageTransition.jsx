import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

// 라우트 전환 시 부드러운 페이드+슬라이드 인 (이전·다음 이동 공통)
function PageTransition({ children }) {
  const { pathname } = useLocation()
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
    )
  }, [pathname])

  return <div ref={ref}>{children}</div>
}

export default PageTransition
