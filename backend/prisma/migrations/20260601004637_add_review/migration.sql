-- CreateTable
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

-- CreateIndex
CREATE INDEX "Review_company_idx" ON "Review"("company");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");
