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

### 고객 영역(`/`)
- **메인 랜딩**: Hero(**큰 통합 검색창** + 통계 카드)·이사 종류 벤토·이용 절차 3단계·**고객 리뷰 캐러셀**·FAQ·CTA
- **사이트 검색**(`/search`): Hero 검색창에 키워드 입력 → 연관 페이지(견적·리뷰·FAQ·공지 등) 카드 안내 + 추천 검색어 칩
- **견적 신청 3단계**: 방식 선택(방문/사진/전화) → 이사 종류 → 신청 폼 (출발·도착지 다음 우편번호 검색 + 상세주소)
- **입찰 비교**(`/quote/bids`): 신청 견적에 들어온 **실제 입찰** 비교(가격·메시지·소요시간), **최저가 배지**, 정렬(최저가/최고가/평점 높은순·낮은순/최신)·업체 평점(고객 리뷰 별점 **서버 집계** — 이용 업체명 기준)·입찰 등록일시, **낙찰 선택 + 계약 전 낙찰 취소**(파트너·관리자에 알림)
- **고객 리뷰**(`/reviews`): 별점·이름(**실명 자동 마스킹**)·이사 종류·**이용 업체**·내용·사진 첨부(메모리), **백엔드 저장(`Review` 모델 — 입찰 비교 평점의 원천)**, **페이지네이션(개수 선택 5~40)**
- **FAQ + 직접 질문**(`/faq`): **관리자가 직접 작성·수정·삭제하는 자주 묻는 질문** + 관리자 답변 Q&A. 전체보기 진입 시 작성 폼은 닫혀 있고 글 목록만 노출(토글), **Q&A 페이지네이션**
- **마이페이지**(`/mypage`): 활동 카드(견적 신청·작성 리뷰·내 질문) + **내 견적 현황 박스**(신청 견적·입찰/낙찰 상태·**낙찰 후 7단계 진행 현황(택배식 타임라인 + 단계별 도달 시각)**·견적 수정·취소·입찰 보기)
- **공지사항**(`/notice`): 관리자 작성·수정·삭제, 모든 사용자에게 알림 푸시

### 파트너 영역(`/partner/*`)
- **메인 랜딩**(`/partner`): Hero(**큰 통합 검색창** + 통계)·혜택 벤토·시작 4단계·**파트너 스토리 캐러셀**·FAQ·CTA, 사이트 검색(`/partner/search`)
- **견적 요청**(`/partner/dashboard`): 들어온 견적 요청 목록(백엔드 연동) + 입찰 제출 (업체명=업체정보, 로그인 필요)
- **내 입찰 현황**(`/partner/bids`): 제출한 입찰·낙찰/거절 + **낙찰건 이사 단계 진행**(낙찰완료→낙찰확인→계약완료→이사준비→이사중→이사완료, "다음 단계로" 버튼) (페이지네이션, 로그인 필요)
- **업체 정보 등록**(`/partner/profile`): 프로필 사진·사업자 정보·**서비스 가능 지역**(권역 → 시·도 → 시·군·구 3단계 트리, 약 229개, **권역 전체 / 시·도별 전체 선택 지원**)·업체 사진(최대 8장)·자격증(이미지+PDF, 최대 5개) 업로드, **백엔드 저장(`PartnerProfile` 모델 + 사진/자격증 Cloudinary, 이메일 1:1 upsert)으로 재진입·다른 기기에서 복원** (로그인 필요)
- **파트너 스토리**(`/partner/story`): 후기 작성 + 검색·페이지네이션, 등록 폼 토글
- **FAQ**(`/partner/faq`): **관리자 직접 편집** 자주 묻는 질문 + 관리자 답변 Q&A (전체보기 = 글만)
- **파트너 마이페이지**(`/partner/mypage`): 활동 카드 + **내 업체 정보** 요약 + **내 입찰 현황 박스**(낙찰건 이사 단계 진행 — `/partner/bids`와 공용 컴포넌트) + "업체정보 수정" 단축 진입
- **공지사항**(`/partner/notice`): 고객 사이트와 같은 공지 데이터 공유

### 관리자 영역(`/admin`)
- **카테고리 사이드바**: 매칭·입찰 / 리뷰 / Q&A / 공지 탭 전환 (선택 섹션만 표시, 모바일은 상단 가로 스크롤)
- **매칭·입찰 현황**: 견적 요청별 카드, 입찰 내역, 최저가, 상태 배지, 페이지네이션
- **리뷰 관리**: 사용자/파트너 리뷰 통합, **숨김·노출 토글**(개인정보 정책상 삭제 불가)·**관리자 답변**(자동 마스킹)·페이지네이션
- **Q&A 답변**: 사용자/파트너 문의 통합, **숨김 토글**(삭제 불가)·답변/수정 (자동 마스킹)·페이지네이션
- **공지사항 관리**: 작성·수정·삭제 — `/notice`·`/partner/notice`와 동일 데이터 즉시 양방향 동기화
- **자동 통계**: 진행 중 견적·누적 입찰·숨김 리뷰·미답변 Q&A·공지 카드
- `isAdmin` 판별: 현재 `user.email === 'admin@movingday.com'` (풀스택 단계에서 `user.role === 'admin'`로 한 줄 교체)

### 인증·회원
- **회원가입**: 이메일 도메인 분리(직접 입력 포함)·닉네임(15자)·**비밀번호(영문+숫자+특수문자 8자 이상, 프론트·백엔드 검증)**·비밀번호 확인·표시 방식 선택(닉네임/실명 마스킹)
- **로그인**: 파트너 컨텍스트(`?role=partner`) 분기, 로그인 후 자동 리다이렉트(/admin·/partner·/)
- **회원정보 수정**(`/account`): 닉네임·전화번호·**헤더 표시 방식**(닉네임/실명)·리뷰/FAQ 표시 방식·**비밀번호 변경(영문+숫자+특수문자 8자 이상, 회원가입과 동일 룰)** — 마이페이지·헤더에 즉시 반영
- **클라이언트 오버라이드**: 이메일 키 기반 localStorage로 닉네임/전화 영속화(백엔드 컬럼 추가 전까지)

### 공통 UI / 인터랙션
- **헤더 통일**: 글래스모피즘(`bg-white/60 backdrop-blur`) + `rounded-b-2xl`, **알림 벨(좌우 흔들기 + 미확인 빨간점 + 드롭다운, 수신자별 필터링)**·사용자 메뉴 드롭다운(GSAP fade+slide)·햄버거(GSAP morph) — 검색은 헤더에서 빼고 Hero 큰 검색창으로 이동
- **알림 시스템(서버 + 로컬 병합)**: BellIcon이 두 출처를 합쳐 최신순으로 보여줌
  - **서버 거래 알림**(`Notification` 테이블): 입찰(`bid`)·낙찰(`award`)·거절(`reject`)·단계변경(`stage`) — 서버가 자동 생성, 로그인 사용자가 **20초 폴링**으로 수신. 고객·파트너가 서로 다른 브라우저여도 도달(localStorage 한계 해결). 열람 시 모두 읽음·비우기 API로 동기화
  - **로컬 알림**(`addNotification({ type, message, link, to })`): 공지(`notice`)·관리자 답변(`reply`)·본인 견적 접수(`quote`) 등 비거래 알림은 기존 localStorage 큐 유지. `to` 지정 시 그 사용자에게만(`!to || to === user.email` 필터)
- **TOP 버튼**: 우하단 고정, 300px 스크롤 이상에서 페이드인
- **페이지 전환**: 모든 라우트에 GSAP fade+slide-in(0.5s, y 16) + 스크롤 최상단 리셋
- **메인 캐러셀**: `snap-x` + 화살표 + 터치 스와이프 + 모바일 1개/태블릿 2개/데스크톱 3개, "전체 보기 →" 링크
- **반응형**(모바일 퍼스트): 모든 페이지 sm/md/lg 브레이크포인트, `break-keep`로 한국어 줄바꿈 안전
- **실명 마스킹**: 메인 캐러셀·리뷰 목록 노출 시·관리자 답변(호칭 앞 한국 이름) 자동 마스킹
- **페이지네이션**: 공용 `usePagination`/`Pagination` — 리뷰·Q&A·입찰·파트너 스토리·관리자 목록 전체, 페이지당 개수 선택(5/10/15/20/30/40)
- **확인 모달**: 삭제·알림을 `window.confirm/alert` 대신 사이트 디자인 커스텀 모달(`useConfirm`)로 통일
- **커스텀 달력**(`DatePicker`): 네이티브 date picker가 스크롤에 닫히는 문제 해결 — 외부 클릭에만 닫힘, 년·월 빠른 선택 (생년월일·이사 날짜)
- **링크 미리보기**: `index.html`에 Open Graph·Twitter Card 메타 — 카카오톡·슬랙·페이스북 등에 URL 붙이면 제목·설명·이미지 썸네일 노출

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
| `QuoteRequest` | name, phone, method(방문/사진/전화), moveType, fromRegion, toRegion, moveDate, homeSize, memo, photos(JSON), visitDate, callTime, status, userEmail(회원 연결·nullable), stage(낙찰 후 진행 단계·nullable) |
| `User` | id, email, password(bcrypt), name, birthDate, gender, phone, verified, createdAt |
| `Bid` | id, quoteRequestId(FK→QuoteRequest, Cascade), bidderEmail, company, price, message, eta, status(입찰/낙찰/거절), createdAt |
| `StageLog` | id, quoteRequestId(FK→QuoteRequest, Cascade), stage, createdAt — 단계 변경 이력(택배식 타임라인) |
| `Notification` | id, toEmail(수신자), type(bid/award/reject/stage), message, link, read, createdAt — 서버 거래 이벤트 알림(폴링 조회) |
| `Review` | id, name, text, rating(1~5), moveType, company(이용 업체·평점 집계 키), authorEmail, hidden(관리자 숨김), reply(관리자 답변), createdAt — 고객 리뷰·업체 평점 원천 |
| `PartnerProfile` | id, email(파트너 1:1 unique), company, bizNo, ceo, phone, trucks, intro, regions(JSON), profileImg(URL), workPhotos(JSON URL), certs(JSON [{url,name,isImage}]), createdAt, updatedAt — 업체 프로필·사진·자격증 |

### 클라이언트 localStorage 키 (영속화)
| 키 | 용도 |
|---|---|
| `movingday_partner_stories` | 파트너 스토리 (`authorEmail` 포함) |
| `movingday_user_qa` / `movingday_partner_qa` | 사용자/파트너 Q&A (관리자 답변 + `authorEmail`) |
| `movingday_user_faqs` / `movingday_partner_faqs` | 자주 묻는 질문(관리자 편집) |
| `movingday_notices` | 공지사항 (고객·파트너 공유) |
| `movingday_notifications` | 알림 큐(수신자 `to` 필드로 필터) |
| `movingday_user_quote_count` / `movingday_partner_bid_count` | 활동 카운트 |
| `movingday_user_overrides_{email}` | 회원정보 클라이언트 오버라이드(닉네임·전화) |
| `movingday_header_mode` / `movingday_display_mode` | 헤더 표시 방식 / 리뷰·FAQ 표시 방식 |
| `partnerProfileSaved` | 파트너 업체정보 등록 플래그(입찰 시작 게이트 — 프로필 자체는 `PartnerProfile` 서버 저장) |
| `movingday_last_quote_id` | 방금 신청한 견적 id(고객 입찰 비교 조회용) |

## 주요 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 확인 |
| POST | `/api/auth/signup` | 회원가입 → JWT 토큰 |
| POST | `/api/auth/login` | 로그인 → JWT 토큰 |
| GET | `/api/auth/me` | 내 정보 (Authorization: Bearer) |
| POST | `/api/quotes` | 견적 신청 (사진 Cloudinary 업로드) |
| GET | `/api/quotes` | 견적 목록 (입찰 포함 — 파트너·관리자) |
| GET | `/api/quotes/mine/:email` | 내 견적 목록 (입찰 포함 — 회원) |
| PATCH | `/api/quotes/:id/stage` | 낙찰 후 진행 단계 변경 (파트너) |
| PATCH | `/api/quotes/:id` | 견적 수정 |
| DELETE | `/api/quotes/:id` | 견적 취소(삭제, 입찰 Cascade) |
| POST | `/api/bids` | 입찰 생성 (파트너) |
| GET | `/api/bids/quote/:id` | 견적별 입찰 목록 (고객 비교) |
| GET | `/api/bids/mine/:email` | 파트너 본인 입찰 |
| PATCH | `/api/bids/:id/accept` | 낙찰 처리 (선택 입찰 낙찰·나머지 거절·견적 완료) |
| PATCH | `/api/bids/:id/cancel` | 낙찰 취소 (계약 전 — 입찰 복원·견적 상담중) |
| GET | `/api/notifications/:email` | 내 알림 목록 (최신순 50건 — 폴링) |
| PATCH | `/api/notifications/:email/read` | 내 알림 모두 읽음 처리 |
| DELETE | `/api/notifications/:email` | 내 알림 모두 비우기 |
| GET | `/api/reviews` | 리뷰 목록 (최신순, 숨김 포함 — 화면별 필터) |
| GET | `/api/reviews/ratings` | 업체별 평점 집계 `[{company, avg, count}]` (숨김 제외) |
| POST | `/api/reviews` | 리뷰 작성 |
| PATCH | `/api/reviews/:id` | 리뷰 수정·숨김 토글·관리자 답변 |
| DELETE | `/api/reviews/:id` | 리뷰 삭제 |
| GET | `/api/partners/:email` | 내 업체 프로필 조회 (없으면 null) |
| PUT | `/api/partners` | 업체 프로필 저장 (multipart — 사진/자격증 Cloudinary, upsert) |

## 배포

- **Frontend**: Vercel 자동 빌드 (GitHub `main` push 시 자동 배포, `frontend/dist`). `/api/*`·`/uploads/*`는 `vercel.json` rewrites로 Render 백엔드로 프록시
- **Backend**: Render Web Service (`movingday-api`). DB는 Turso(libSQL), 견적 사진은 Cloudinary
- **DB**: Turso (libSQL) — Prisma 7 `@prisma/adapter-libsql` 어댑터로 연결. 로컬 dev는 그대로 `better-sqlite3` (URL이 `file:...`면 자동 분기)
- **사진 업로드**: Cloudinary — multer가 메모리에 받은 버퍼를 공용 헬퍼(`src/cloudinary.ts`)의 `upload_stream`으로 전송, `secure_url`을 DB에 저장. 견적 사진(이미지)·파트너 프로필 사진·자격증(이미지+PDF, `resource_type` 분기)에 공통 사용

### 백엔드(Render) 환경변수 — 시크릿은 절대 저장소에 두지 않음

| 변수 | 설명 | 예시 |
|---|---|---|
| `DATABASE_URL` | Turso DB URL | `libsql://<db>.turso.io` |
| `DATABASE_AUTH_TOKEN` | Turso 토큰 | (시크릿) |
| `JWT_SECRET` | JWT 서명 키(긴 임의 문자열) | (시크릿) |
| `FRONTEND_URL` | CORS 화이트리스트(콤마 다중) | `https://moving-day.vercel.app,http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary 계정 이름 | `movingday` |
| `CLOUDINARY_API_KEY` | (시크릿) | |
| `CLOUDINARY_API_SECRET` | (시크릿) | |

### 프론트엔드(Vercel) 환경변수 — 선택

| 변수 | 설명 | 기본 동작 |
|---|---|---|
| `VITE_API_BASE` | 백엔드 절대 URL (선택) | 비워두면 `vercel.json` rewrites가 `/api/*`를 Render로 자동 프록시 |

> `vercel.json`에 `/api/:path*` → `https://movingday-api.onrender.com/api/:path*` rewrite가 이미 설정돼 있어서 별도 지정 없이 동작합니다. 디버깅이나 다른 백엔드 도메인을 쓰고 싶을 때만 채우세요.

### Render Web Service 설정

```
Name              movingday-api
Region            Oregon (US West) — Turso DB와 같은 리전으로 맞춰 쿼리 왕복 최소화
Root Directory    backend
Build Command     npm install
Start Command     npm start
```

### Turso 초기 스키마 적용 (한 번만)

`backend/prisma/turso-init.sql`(최종 스키마 1:1, 빈 DB에 통째로 붙여넣기 가능)을 한 번 적용하면 됩니다.

- **웹 대시보드 (Windows 권장)**: Turso 대시보드 → DB → SQL 콘솔(Studio)에 `turso-init.sql` 내용을 붙여넣고 실행
- **CLI (WSL/Mac/Linux)**: `turso db shell movingday-angun1546 < backend/prisma/turso-init.sql`

이후 새 마이그레이션은 `prisma/migrations/<새 이름>/migration.sql`만 추가 적용합니다.

데모용 더미 리뷰가 필요하면 `npm run db:seed`(빈 DB일 때만 6건 삽입, 멱등)를 실행합니다. 로컬은 `DATABASE_URL=file:./prisma/dev.db npm run db:seed`, Turso는 `.env`가 설정된 상태에서 `npm run db:seed`.

### 배포 순서 (처음 한 번)

1. **Cloudinary** 가입 → Dashboard에서 `Cloud name` / `API Key` / `API Secret` 확보
2. **Turso** 가입 후 DB 생성 (Windows는 CLI 공식 바이너리가 없어 **웹 대시보드 권장** — Create Database로 DB 생성, Region은 Render와 같은 Oregon, Database URL 복사 + Create Token으로 토큰 발급, SQL 콘솔에 `turso-init.sql` 적용). CLI 환경이면 `turso db create` / `turso db show` / `turso db tokens create` 사용
3. **Render**에서 GitHub 저장소 연결해 위 표대로 Web Service 생성, Environment에 7개 환경변수 입력 → Deploy
4. Render 도메인(예: `https://movingday-api.onrender.com`) 확정되면 `vercel.json`의 rewrite 대상 URL이 맞는지 확인 (필요 시 수정 후 push)
5. **Vercel** 대시보드에서 자동 재배포 — 그 다음 `/api/health`가 `{ok:true}` 반환하면 연결 성공

## 로드맵

1. **프론트 멀티테넌시 골격** (완료) — 경로 기반 고객/파트너/관리자 분리
2. **풀스택 role 시스템** (예정) — `User.role(customer/partner/admin)` + `partner_profiles` 1:1 + 회원가입 시 역할 선택 + role 기반 가드/리다이렉트
3. **사진·자격증 업로드 백엔드 연동** (완료) — `PartnerProfile` 모델 + `/api/partners`(GET·PUT upsert). 공용 Cloudinary 헬퍼(`src/cloudinary.ts`)로 프로필 사진·업체 사진·자격증(이미지+PDF) 업로드, 새로 올리면 교체·아니면 기존 URL 유지. PartnerProfilePage·PartnerMyPage 서버 연동(리뷰 사진은 별도로 아직 메모리)
4. **입찰 실제 DB 연동** (완료) — `Bid` 모델 + 파트너 입찰·고객 비교·관리자 매칭 + 낙찰/낙찰 취소 + 7단계 진행 추적
5. **업체 평점 시스템** (완료) — 고객 리뷰 백엔드화(`Review` 모델 + CRUD) + 업체별 평점 집계 API(`/api/reviews/ratings`) → 입찰 비교에서 실제 평점 데이터로 정렬. 리뷰 작성·관리자 숨김/답변·메인 캐러셀·마이페이지 카운트 전부 서버 연동(리뷰 사진은 메모리 유지)
6. **실시간 알림** (핵심 완료) — 서버 `Notification` 테이블 + 거래 이벤트(입찰·낙찰·거절·단계변경) 20초 폴링 알림. 향후 웹소켓·알림톡으로 확장
