# 이삿날 (Moving Day)

믿을 수 있는 이사 견적 비교 플랫폼. (아정당·이사대학 모티브)

검증된 업체의 견적을 한 번에 비교하고 신청하는 서비스입니다.

## 구조

```
Moving-day/
├── frontend/   # Vite + React SPA (React Router 데이터 모드, Tailwind v4)
├── backend/    # Express + Prisma + SQLite (REST API, 업로드 파일은 uploads/)
├── claude.md   # 개발 지침
└── design.md   # 디자인 가이드
```

## 기술 스택

- **프론트엔드**: React 19, React Router 7 (데이터 모드), Vite 8, Tailwind CSS v4, Pretendard/Inter
- **백엔드**: Node.js, Express 5, Prisma 7, SQLite (better-sqlite3 어댑터), multer(사진 업로드)
- **주소 검색**: 다음(카카오) 우편번호 서비스

## 주요 기능

- **메인 랜딩**: Hero, 이사 종류(벤토 그리드), 이용 절차 3단계, 고객 후기, CTA
- **견적 신청 (3단계 플로우)**
  1. **견적 방식 선택** — ① 방문 견적 ② 비대면 사진 견적(추가금 없음) ③ 실시간 전화상담 견적
  2. **이사 종류 선택** — 포장이사 / 반포장이사 / 일반이사 / 사무실이사
  3. **방식별 신청 폼** — 방문견적: 방문 희망 일시 / 사진견적: 사진 첨부(필수) / 전화상담: 통화 희망 시간대
- **출발지·도착지 주소 검색** — 다음 우편번호 팝업으로 정확한 주소 입력
- **사진 첨부** — 짐 사진 업로드(이미지, 최대 5장)로 더 정확한 견적
- **반응형 UI** — 모바일 햄버거 메뉴 지원
- **로그인 / 회원가입** — 준비 중(자리 표시)

## 실행 방법

### 방법 A — 루트에서 한 번에 (추천)

루트 폴더에서 아래 명령이면 백엔드(4000) + 프론트(5173)가 동시에 뜹니다.

```bash
npm install        # 최초 1회 (루트 도구 설치)
npm run dev        # 백엔드 + 프론트 동시 실행 (종료: Ctrl + C)
```

> 최초 1회는 각 폴더의 의존성 설치와 DB 생성이 필요합니다.
> `cd backend && npm install && npm run db:migrate` / `cd frontend && npm install`

### 방법 B — 따로 실행 (터미널 2개)

#### 1) 백엔드 (API 서버, 포트 4000)

```bash
cd backend
npm install        # 최초 1회
npm run db:migrate # 최초 1회 (DB 생성)
npm run dev
```

#### 2) 프론트엔드 (포트 5173)

```bash
cd frontend
npm install        # 최초 1회
npm run dev
```

브라우저에서 http://localhost:5173 접속. (프론트의 `/api`, `/uploads` 요청은 백엔드 4000으로 자동 프록시됩니다.)

## 데이터 모델 (QuoteRequest)

| 필드 | 설명 |
|------|------|
| name, phone | 신청자 이름·연락처 (필수) |
| method | 견적 방식: 방문견적 / 사진견적 / 전화상담 (필수) |
| moveType | 이사 종류: 포장이사 / 반포장이사 / 일반이사 / 사무실이사 (필수) |
| fromRegion, toRegion | 출발지·도착지 주소 (필수) |
| moveDate, homeSize, memo | 이사 예정일·주거형태·요청사항 (선택) |
| visitDate | 방문 희망 일시 (방문견적) |
| callTime | 통화 희망 시간대 (전화상담) |
| photos | 첨부 사진 경로 목록(JSON) — 사진견적은 필수 |
| status | 처리 상태 (기본 "접수") |

## 주요 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 확인 |
| POST | `/api/quotes` | 이사 견적 신청 등록 (multipart/form-data, 사진 첨부 가능) |
| GET | `/api/quotes` | 견적 신청 목록 (관리용) |
