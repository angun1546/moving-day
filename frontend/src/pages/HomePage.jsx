import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import BentoServices from '../components/BentoServices'
import ProcessSteps from '../components/ProcessSteps'
import Reviews from '../components/Reviews'
import Faq from '../components/Faq'
import CtaBanner from '../components/CtaBanner'
import { useHoverLift } from '../hooks/useHoverLift'

function HomePage() {
  const ref = useRef(null)
  useHoverLift(ref) // 박스·버튼에 호버 시 살짝 떠오르며 그림자

  // 다른 페이지에서 헤더 메뉴로 진입한 경우 해당 섹션으로 스크롤
  const location = useLocation()
  useEffect(() => {
    const target = location.state?.scrollTo
    if (!target) return
    const t = setTimeout(() => {
      if (target === '#hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
    return () => clearTimeout(t)
  }, [location])

  return (
    <div ref={ref}>
      <HeroSection />
      <BentoServices />
      <ProcessSteps />
      <Reviews />
      <Faq />
      <CtaBanner />
    </div>
  )
}

export default HomePage
