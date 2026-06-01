import { useEffect } from 'react'
import gsap from 'gsap'

// 박스(카드)·버튼 식별 셀렉터 — 둥근 카드/버튼/링크형
const SEL =
  'button, a[class*="rounded"], [class*="rounded-2xl"], [class*="rounded-3xl"]'

// 마우스 올리면 살짝 떠오르며 그림자가 생기는 GSAP 호버 (이벤트 위임)
//  - ref 컨테이너 안의 카드·버튼에 적용
//  - 위임이라 캐러셀처럼 나중에 생기는 카드도 자동 커버
export function useHoverLift(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    function over(e) {
      const el = e.target.closest(SEL)
      if (!el || !root.contains(el)) return
      gsap.to(el, {
        y: -6,
        boxShadow: '0 14px 30px rgba(0,0,0,0.12)',
        duration: 0.18,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
    function out(e) {
      const el = e.target.closest(SEL)
      if (!el || !root.contains(el)) return
      // 요소 내부로 이동하는 경우(자식으로)는 무시
      if (e.relatedTarget && el.contains(e.relatedTarget)) return
      gsap.to(el, {
        y: 0,
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        duration: 0.18,
        ease: 'power2.out',
        clearProps: 'boxShadow,transform',
        overwrite: 'auto',
      })
    }

    root.addEventListener('mouseover', over)
    root.addEventListener('mouseout', out)
    return () => {
      root.removeEventListener('mouseover', over)
      root.removeEventListener('mouseout', out)
    }
  }, [ref])
}
