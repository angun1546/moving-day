-- 이삿날 Turso(libSQL) 초기 스키마 — 빈 DB에 한 번만 적용
-- 적용 방법: Turso 웹 대시보드 SQL 콘솔에 붙여넣기, 또는
--   turso db shell <db-name> < prisma/turso-init.sql
-- schema.prisma의 최종 모델과 1:1 일치 (마이그레이션 누적본이 아닌 최종 형태)

-- 이사 견적 신청
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "moveType" TEXT NOT NULL,
    "fromRegion" TEXT NOT NULL,
    "toRegion" TEXT NOT NULL,
    "moveDate" TEXT,
    "homeSize" TEXT,
    "memo" TEXT,
    "photos" TEXT,
    "method" TEXT NOT NULL,
    "visitDate" TEXT,
    "callTime" TEXT,
    "status" TEXT NOT NULL DEFAULT '접수',
    "userEmail" TEXT,
    "stage" TEXT
);
CREATE INDEX "QuoteRequest_createdAt_idx" ON "QuoteRequest"("createdAt");

-- 회원
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TEXT,
    "gender" TEXT,
    "phone" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- 업체 입찰
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quoteRequestId" TEXT NOT NULL,
    "bidderEmail" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "message" TEXT,
    "eta" TEXT,
    "status" TEXT NOT NULL DEFAULT '입찰',
    CONSTRAINT "Bid_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Bid_quoteRequestId_idx" ON "Bid"("quoteRequestId");

-- 진행 단계 이력
CREATE TABLE "StageLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quoteRequestId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    CONSTRAINT "StageLog_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "StageLog_quoteRequestId_idx" ON "StageLog"("quoteRequestId");

-- 사용자 알림 (서버 거래 이벤트 — 폴링 조회)
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toEmail" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX "Notification_toEmail_createdAt_idx" ON "Notification"("toEmail", "createdAt");
