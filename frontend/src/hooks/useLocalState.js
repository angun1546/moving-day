import { useEffect, useState } from 'react'

// localStorage에 영속화되는 useState — 작성된 리뷰/FAQ가 새로고침 후에도 유지
export function useLocalState(key, initial) {
  const [val, setVal] = useState(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch {
      // 용량 초과 등 — 무시
    }
  }, [key, val])

  return [val, setVal]
}
