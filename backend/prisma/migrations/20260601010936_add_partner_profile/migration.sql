-- CreateTable
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PartnerProfile_email_key" ON "PartnerProfile"("email");
