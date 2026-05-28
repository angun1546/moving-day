# 이삿날 (Moving Day)

믿을 수 있는 이사 견적 비교 플랫폼. (아정당·이사대학 모티브)

검증된 이사업체들이 **입찰로 경쟁**하고, 고객은 가격·평점·후기를 비교해 가장 좋은 곳을 선택합니다.

## 구조

```
Moving-day/
├── frontend/                  # Vite + React 19 SPA (React Router 데이터 모드, Tailwind v4)
│   ├── src/
│   │   ├── components/        # 공통 컴포넌트 (Header·PartnerLayout·ReviewCarousel·UserMenu·TopButton 등)
│   │   ├── pages/             # 라우트 단위 페이지 (고객·파트너·관리자)
│   │   ├── hooks/             # useLocalState (영속화 훅)
│   │   ├── context/           # AuthContext (user·isAdmin·headerMode·오버라이드)
│   │   ├── utils/             # userDisplay(마스킹)·date·regions
│   │   ├── data/              # bids·requests·sampleReviews 목업
│   │   ├── services/          # auth·quotes API 클라이언트
│   │   └── router/index.jsx   # createBrowserRouter
├── backend/                   # Express 5 + Prisma 7 + SQLite (auth·quotes REST API)
├── md/design.md               # 디자인 가이드 (그린 팔레트·Pretendard/Inter·벤토)
├── CLAUDE.md                  # Claude Code 작업 가이드
└── GEMINI.md                  # Gemini CLI 작업 가이드
```

## 기술 스택

- **프론트엔드**: React 19, React Router 7 (Data Mode), Vite 8, Tailwind CSS v4, GSAP(애니메이션), Pretendard/Inter
- **백엔드**: Node.js, Express 5, Prisma 7, SQLite (better-sqlite3 어댑터), multer, JWT
- **주소 검색**: 다음(카카오) 우편번호 서비스
- **배포**: Vercel (frontend 단독) — backend는 풀스택 단계에서 Render/Turso 예정

## 주요 기능

### 🧑 고객 영역(`/`)
- **메인 랜딩**: Hero(통계 카드)·이사 종류 벤토·이용 절차 3단계·**고객 리뷰 캐러셀**·FAQ·CTA
- **견적 신청 3단계**: 방식 선택(방문/사진/전화) → 이사 종류 → 신청 폼 (출발·도착지 다음 우편번호 검색 + 상세주소)
- **입찰 비교**(`/quote/bids`): 업체별 가격·평점·서비스·메시지, **최저가/평점 1위 배지**, 정렬(최저가/평점), 선택
- **고객 리뷰**(`/reviews`): 별점·이름·이사 종류·**이용 업체**·내용·사진 첨부(메모리), localStorage 영속화
- **FAQ + 직접 질문**(`/faq`): 자주묻는질문 + 관리자 답변 Q&A
- **마이페이지**(`/mypage`): 활동 카드(견적 신청·작성 리뷰·내 질문) → 클릭 시 해당 페이지

### 🏢 파트너 영역(`/partner/*`)
- **메인 랜딩**(`/partner`): Hero(통계)·혜택 벤토·시작 4단계·**파트너 스토리 캐러셀**·FAQ·CTA
- **입찰 대시보드**(`/partner/dashboard`): 들어온 견적 요청 + 입찰 제출 (로그인 필요)
- **업체 정보 등록**(`/partner/profile`): 프로필 사진·사업자 정보·**서비스 가능 지역**(권역 → 시·도 → 시·군·구 3단계 트리, 약 229개)·업체 사진·자격증 업로드 (로그인 필요)
- **파트너 스토리**(`/partner/story`): 후기 작성 + 검색·페이지네이션, 등록 폼 토글
- **FAQ**(`/partner/faq`): 자주묻는질문 + 관리자 답변 Q&A
- **파트너 마이페이지**(`/partner/mypage`): 받은 입찰·작성 스토리·내 질문 활동 카드

### 🛡️ 관리자 영역(`/admin`)
- **매칭·입찰 현황**: 견적 요청별 카드, 입찰 내역, 최저가, 상태 배지
- **리뷰 관리**: 사용자/파트너 리뷰 통합 표시, 숨김·노출 토글·삭제·**관리자 답변**(자동 마스킹)
- **Q&A 답변**: 사용자/파트너 문의 통합, 답변/수정/삭제 (자동 마스킹)
- **자동 통계**: 진행 중 견적·누적 입찰·숨김 리뷰·미답변 Q&A 카드
- `isAdmin` 판별: 현재 `user.email === 'admin@movingday.com'` (풀스택 단계에서 `user.role === 'admin'`로 한 줄 교체)

### 🔐 인증·회원
- **회원가입**: 이메일 도메인 분리(직접 입력 포함)·닉네임(15자)·비밀번호 확인·**표시 방식 선택**(닉네임/실명 마스킹)
- **로그인**: 파트너 컨텍스트(`?role=partner`) 분기, 로그인 후 자동 리다이렉트(/admin·/partner·/)
- **회원정보 수정**(`/account`): 닉네임·전화번호·**헤더 표시 방식**(닉네임/실명)·리뷰/FAQ 표시 방식·비밀번호 — 마이페이지·헤더에 즉시 반영
- **클라이언트 오버라이드**: 이메일 키 기반 localStorage로 닉네임/전화 영속화(백엔드 컬럼 추가 전까지)

### 🎨 공통 UI / 인터랙션
- **헤더 통일**: 글래스모피즘(`bg-white/60 backdrop-blur`) + `rounded-b-2xl`, 검색창(SVG 돋보기)·알림 벨(클릭 시 GSAP `keyframes`로 좌우 흔들기)·사용자 메뉴 드롭다운(GSAP fade+slide)·햄버거(GSAP morph)
- **TOP 버튼**: 우하단 고정, 300px 스크롤 이상에서 페이드인
- **페이지 전환**: 모든 라우트에 GSAP fade+slide-in(0.5s, y 16) + 스크롤 최상단 리셋
- **메인 캐러셀**: `snap-x` + 화살표 + 터치 스와이프 + 모바일 1개/태블릿 2개/데스크톱 3개, "전체 보기 →" 링크
- **반응형**(모바일 퍼스트): 모든 페이지 sm/md/lg 브레이크포인트, `break-keep`로 한국어 줄바꿈 안전
- **실명 마스킹**: 메인 캐러셀 노출 시·관리자 답변(호칭 앞 한국 이름) 자동 마스킹

## 실행 방법

### 방법 A — 루트에서 한 번에 (추천)

```bash
npm install        # 최초 1회 (루트 도구 설치)
npm run dev        # 백엔드(4000) + 프론트(5173) 동시 실행
```

> 최초 1회는 각 폴더의 의존성 설치와 DB 생성이 필요합니다.
> `cd backend && npm install && npm run db:migrate` / `cd frontend && npm install`

### 방법 B — 따로 실행 (터미널 2개)

```bash
cd backend && npm install && npm run db:migrate && npm run dev   # 4000
cd frontend && npm install && npm run dev                          # 5173
```

브라우저에서 `http://localhost:5173` 접속. (프론트의 `/api`, `/uploads` 요청은 백엔드 4000으로 자동 프록시.)

### 관리자 계정
백엔드를 띄운 상태에서 회원가입 시 이메일을 `admin@movingday.com`로 가입하면 자동으로 관리자 권한이 부여됩니다. 로그인 후 헤더 우측 앰버색 `관리자` 배지로 `/admin` 진입.

## 데이터 모델

### 백엔드 (Prisma)
| 모델 | 주요 필드 |
|------|------|
| `QuoteRequest` | name, phone, method(방문/사진/전화), moveType, fromRegion, toRegion, moveDate, homeSize, memo, photos(JSON), visitDate, callTime, status |
| `User` | id, email, password(bcrypt), name, birthDate, gender, phone, verified, createdAt |

### 클라이언트 localStorage 키 (영속화)
| 키 | 용도 |
|---|---|
| `movingday_user_reviews` | 고객 리뷰 |
| `movingday_partner_stories` | 파트너 스토리 |
| `movingday_user_qa` / `movingday_partner_qa` | 사용자/파트너 Q&A (관리자 답변 포함) |
| `movingday_user_quote_count` / `movingday_partner_bid_count` | 활동 카운트 |
| `movingday_user_overrides_{email}` | 회원정보 클라이언트 오버라이드(닉네임·전화) |
| `movingday_header_mode` / `movingday_display_mode` | 헤더 표시 방식 / 리뷰·FAQ 표시 방식 |
| `partnerProfileSaved` | 파트너 업체정보 등록 플래그(입찰 시작 게이트) |

## 주요 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 확인 |
| POST | `/api/auth/signup` | 회원가입 → JWT 토큰 |
| POST | `/api/auth/login` | 로그인 → JWT 토큰 |
| GET | `/api/auth/me` | 내 정보 (Authorization: Bearer) |
| POST | `/api/quotes` | 견적 신청 등록 (multipart/form-data, 사진 첨부 가능) |
| GET | `/api/quotes` | 견적 신청 목록 (관리용) |

## 배포

- **Frontend**: Vercel 자동 빌드 (GitHub `main` push 시 자동 배포, `frontend/dist`)
- **Backend**: 미배포(로컬 dev 전용). 배포된 사이트의 리뷰/FAQ/입찰 등은 클라이언트 localStorage 기반 목업으로 동작 — 풀스택 단계에서 Render/Turso 연동 예정

## 로드맵

1. ✅ **프론트 멀티테넌시 골격** (완료) — 경로 기반 고객/파트너/관리자 분리
2. 🔧 **풀스택 role 시스템** — `User.role(customer/partner/admin)` + `partner_profiles` 1:1 + 회원가입 시 역할 선택 + role 기반 가드/리다이렉트
3. 🔧 **사진·자격증 업로드 백엔드 연동** (기존 multer 재사용 + S3/디스크)
4. 🔧 **입찰·매칭 실제 DB 연동** (`Bid`·`Company` 모델 추가)
5. 📅 **실시간 알림** (웹소켓·알림톡) — MVP 외, 나중
