// 백엔드(Prisma) 응답 모양 — 프론트가 소비하는 핵심 엔티티 타입
// API 경계(서비스 ↔ 백엔드)를 한곳에서 정의해 필드 변경 시 컴파일 단계에서 잡는다.

export interface User {
  id: string
  email: string
  name: string
  role: string // customer | partner | admin
  birthDate?: string | null
  gender?: string | null
  phone?: string | null
  verified?: boolean
  nickname?: string // 클라이언트 표시용(서버 컬럼 외)
}

export interface AuthResult {
  token: string
  user: User
}

export interface Bid {
  id: string
  createdAt: string
  quoteRequestId: string
  bidderEmail: string
  company: string
  price: number
  message?: string | null
  eta?: string | null
  status: string // 입찰 | 낙찰 | 거절
}

export interface StageLog {
  id: string
  createdAt: string
  quoteRequestId: string
  stage: string
}

// 부가 서비스 선택 — QuoteRequest.addons(JSON 문자열)의 파싱 결과
export interface QuoteAddons {
  cleaning?: string // 청소(단일 선택)
  storage?: string[] // 창고보관(복수)
  document?: string[] // 문서보관·파쇄(복수)
}

export interface QuoteRequest {
  id: string
  createdAt: string
  name: string
  phone: string
  moveType: string
  fromRegion: string
  toRegion: string
  moveDate?: string | null
  homeSize?: string | null
  memo?: string | null
  addons?: string | null // 부가 서비스 JSON 문자열(QuoteAddons)
  photos?: string | null // JSON 문자열(URL 배열)
  method: string // 방문견적 | 사진견적 | 전화상담
  visitDate?: string | null
  callTime?: string | null
  status: string // 접수 | 상담중 | 완료
  userEmail?: string | null
  stage?: string | null
  bids?: Bid[]
  stageLogs?: StageLog[]
}

export interface Review {
  id: string
  createdAt: string
  name: string
  text: string
  rating: number // 1~5
  moveType?: string | null
  company?: string | null
  authorEmail?: string | null
  hidden: boolean
  reply?: string | null
}

export interface PartnerProfile {
  id: string
  email: string
  company: string
  bizNo: string
  ceo: string
  phone: string
  trucks?: string | null
  intro?: string | null
  regions: string // JSON 문자열(지역 배열)
  profileImg?: string | null
  workPhotos?: string | null // JSON 문자열(URL 배열)
  certs?: string | null // JSON 문자열([{url,name,isImage}])
}

export interface Notice {
  id: string
  createdAt: string
  title: string
  body: string
}

export interface Qna {
  id: string
  createdAt: string
  scope: string // user | partner
  name: string
  q: string
  a?: string | null // 관리자 답변(없으면 미답변)
  authorEmail?: string | null
  hidden: boolean
}

export interface PartnerStory {
  id: string
  createdAt: string
  company: string
  text: string
  rating: number // 1~5
  authorEmail?: string | null
  hidden: boolean
  reply?: string | null
}

export interface Notification {
  id: string
  createdAt: string
  toEmail: string
  type: string // bid | award | reject | stage
  message: string
  link?: string | null
  read: boolean
}

// 업체별 평점 집계 (/api/reviews/ratings)
export interface Rating {
  company: string
  avg: number
  count: number
}

// 무빙 프로젝트 — 갤러리·포트폴리오 글(kind로 구분)
export interface ProjectPost {
  id: string
  createdAt: string
  kind: string // gallery | portfolio
  title: string
  excerpt: string
  image?: string | null // 대표 사진 URL(Cloudinary)
}

// 무빙 브이로그 — 유튜브 영상
export interface Vlog {
  id: string
  createdAt: string
  title: string
  videoUrl: string
}
