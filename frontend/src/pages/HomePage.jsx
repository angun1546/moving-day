import { useRef } from 'react'
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
