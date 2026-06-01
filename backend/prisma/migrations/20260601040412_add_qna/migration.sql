-- CreateTable
CREATE TABLE "Qna" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scope" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "q" TEXT NOT NULL,
    "a" TEXT,
    "authorEmail" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE INDEX "Qna_scope_createdAt_idx" ON "Qna"("scope", "createdAt");
