# 이삿날 (Moving Day)

믿을 수 있는 이사 견적 비교 플랫폼. (아정당·이사대학 모티브)

검증된 업체의 견적을 한 번에 비교하고 신청하는 서비스입니다.

## 구조

```
Moving-day/
├── frontend/   # Vite + React SPA (React Router 데이터 모드, Tailwind v4)
├── backend/    # Express + Prisma + SQLite (REST API)
├── claude.md   # 개발 지침
└── design.md   # 디자인 가이드
```

## 기술 스택

- **프론트엔드**: React 19, React Router 7 (데이터 모드), Vite 8, Tailwind CSS v4, Pretendard/Inter
- **백엔드**: Node.js, Express 5, Prisma 7, SQLite (better-sqlite3 어댑터)

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

브라우저에서 http://localhost:5173 접속. (프론트의 `/api` 요청은 백엔드 4000으로 자동 프록시됩니다.)

## 주요 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 확인 |
| POST | `/api/quotes` | 이사 견적 신청 등록 |
| GET | `/api/quotes` | 견적 신청 목록 (관리용) |
