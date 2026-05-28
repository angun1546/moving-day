-- CreateTable
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
    "status" TEXT NOT NULL DEFAULT '접수'
);

-- CreateIndex
CREATE INDEX "QuoteRequest_createdAt_idx" ON "QuoteRequest"("createdAt");
-- AlterTable
ALTER TABLE "QuoteRequest" ADD COLUMN "photos" TEXT;
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
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
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
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password") SELECT "createdAt", "email", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
