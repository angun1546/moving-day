import { useState, useEffect } from 'react'

// 목록 페이지네이션 — items를 perPage씩 나눠 현재 페이지 조각만 반환
// perPage는 내부 state라 화면에서 개수 선택 버튼으로 바꿀 수 있다
export function usePagination(items, initialPerPage = 5) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPageState] = useState(initialPerPage)
  const totalPages = Math.max(1, Math.ceil(items.length / perPage))

  // 항목 수가 줄어 현재 페이지가 범위를 벗어나면 보정
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  // 페이지당 개수 변경 시 1페이지로 이동
  function setPerPage(n) {
    setPerPageState(n)
    setPage(1)
  }

  const start = (page - 1) * perPage
  const pageItems = items.slice(start, start + perPage)
  return { page, setPage, perPage, setPerPage, totalPages, pageItems }
}
