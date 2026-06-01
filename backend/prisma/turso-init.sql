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
    "role" TEXT NOT NULL DEFAULT 'customer',
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

-- 고객 리뷰 (업체별 평점 집계 원천)
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "moveType" TEXT,
    "company" TEXT,
    "authorEmail" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "reply" TEXT
);
CREATE INDEX "Review_company_idx" ON "Review"("company");
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

-- 공지사항 (관리자 작성, 고객·파트너 공유)
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL
);
CREATE INDEX "Notice_createdAt_idx" ON "Notice"("createdAt");

-- 파트너(업체) 프로필 (이메일 1:1, 사진/자격증은 Cloudinary URL)
CREATE TABLE "PartnerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "bizNo" TEXT NOT NULL,
    "ceo" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "trucks" TEXT,
    "intro" TEXT,
    "regions" TEXT NOT NULL DEFAULT '[]',
    "profileImg" TEXT,
    "workPhotos" TEXT,
    "certs" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "PartnerProfile_email_key" ON "PartnerProfile"("email");

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
