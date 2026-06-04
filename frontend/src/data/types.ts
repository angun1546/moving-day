// 공유 도메인 타입 — 데이터 레이어 단일 출처
// 데이터 파일·소비 컴포넌트가 같은 모양을 공유하도록 한 곳에 모은다.

// 상세 특징 항목 (랜딩/상세 페이지의 '이런 점이 좋아요')
export interface Point {
  icon: string
  title: string
  desc: string
}

// 청소·창고보관·문서보관 상품 (sub: 원래 명칭 — 청소만 사용)
export interface ServiceProduct {
  slug: string
  label: string
  icon: string
  desc: string
  sub?: string
  tagline?: string
  intro?: string
  points?: Point[]
}

// 견적 방식 (방문/사진/전화)
export interface QuoteMethod {
  slug: string
  label: string
  title: string
  icon: string
  desc: string
  badge?: string
}

// 이사 종류 (가정/기업 그룹)
export interface MoveType {
  slug: string
  label: string
  icon: string
  desc: string
  group: string
}

// 사이트 검색 인덱스의 한 페이지
export interface SearchPage {
  title: string
  desc: string
  path: string
  icon: string
  keywords: string[]
}
