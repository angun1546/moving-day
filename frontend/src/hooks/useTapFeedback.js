import { useEffect } from 'react'
import gsap from 'gsap'

// 전역 탭 피드백 — 버튼·링크를 누르면 아주 미세하게 눌렸다 돌아오는 인터랙션
// design.md의 "버튼 누를 때 미세하고 부드러운 마이크로 인터랙션" 구현
// 제외하려면 요소에 data-no-tap 속성을 준다
export function useTapFeedback() {
  useEffect(() => {
    function onPointerDown(e) {
      const el = e.target.closest('button, a, [role="button"]')
      if (!el || el.dataset.noTap !== undefined) return
      gsap.fromTo(
        el,
        { scale: 0.95 },
        {
          scale: 1,
          duration: 0.3,
          ease: 'back.out(2.5)',
          // 끝나면 인라인 transform 제거 → CSS hover(translate) 정상 복원
          clearProps: 'transform',
        },
      )
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])
}
