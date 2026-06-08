-- CreateTable
CREATE TABLE "ProjectPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "Vlog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "ProjectPost_kind_createdAt_idx" ON "ProjectPost"("kind", "createdAt");

-- CreateIndex
CREATE INDEX "Vlog_createdAt_idx" ON "Vlog"("createdAt");
