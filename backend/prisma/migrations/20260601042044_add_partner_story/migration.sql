-- CreateTable
CREATE TABLE "PartnerStory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "authorEmail" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "reply" TEXT
);

-- CreateIndex
CREATE INDEX "PartnerStory_createdAt_idx" ON "PartnerStory"("createdAt");
