-- AlterTable
ALTER TABLE "QuoteRequest" ADD COLUMN "stage" TEXT;
ALTER TABLE "QuoteRequest" ADD COLUMN "userEmail" TEXT;

-- CreateTable
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

-- CreateTable
CREATE TABLE "StageLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quoteRequestId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    CONSTRAINT "StageLog_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toEmail" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE INDEX "Bid_quoteRequestId_idx" ON "Bid"("quoteRequestId");

-- CreateIndex
CREATE INDEX "StageLog_quoteRequestId_idx" ON "StageLog"("quoteRequestId");

-- CreateIndex
CREATE INDEX "Notification_toEmail_createdAt_idx" ON "Notification"("toEmail", "createdAt");
