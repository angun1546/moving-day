-- CreateTable
CREATE TABLE "Consult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "moveType" TEXT,
    "content" TEXT,
    "status" TEXT NOT NULL DEFAULT '접수',
    "memo" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "authorEmail" TEXT
);

-- CreateIndex
CREATE INDEX "Consult_createdAt_idx" ON "Consult"("createdAt");
