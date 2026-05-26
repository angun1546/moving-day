import { useCallback } from 'react'

// 다음(카카오) 우편번호 서비스 스크립트
const SRC = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

// 스크립트를 한 번만 로드한다
function load() {
  return new Promise((resolve, reject) => {
    if (window.daum && window.daum.Postcode) return resolve()
    let s = document.querySelector(`script[src="${SRC}"]`)
    if (s) {
      s.addEventListener('load', () => resolve())
      s.addEventListener('error', reject)
      return
    }
    s = document.createElement('script')
    s.src = SRC
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

// 주소 검색 팝업을 열고, 선택한 주소를 onSelect로 전달한다
export function usePostcode() {
  return useCallback((onSelect) => {
    load()
      .then(() => {
        new window.daum.Postcode({
          oncomplete: (data) => onSelect(data.address),
        }).open()
      })
      .catch(() => alert('주소 검색을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'))
  }, [])
}
