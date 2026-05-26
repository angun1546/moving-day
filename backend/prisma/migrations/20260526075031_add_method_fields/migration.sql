/*
  Warnings:

  - Added the required column `method` to the `QuoteRequest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuoteRequest" (
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
    "status" TEXT NOT NULL DEFAULT '접수'
);
INSERT INTO "new_QuoteRequest" ("createdAt", "fromRegion", "homeSize", "id", "memo", "moveDate", "moveType", "name", "phone", "photos", "status", "toRegion") SELECT "createdAt", "fromRegion", "homeSize", "id", "memo", "moveDate", "moveType", "name", "phone", "photos", "status", "toRegion" FROM "QuoteRequest";
DROP TABLE "QuoteRequest";
ALTER TABLE "new_QuoteRequest" RENAME TO "QuoteRequest";
CREATE INDEX "QuoteRequest_createdAt_idx" ON "QuoteRequest"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
