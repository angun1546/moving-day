-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Complaint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT '접수',
    "reply" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "authorEmail" TEXT
);
INSERT INTO "new_Complaint" ("authorEmail", "contact", "content", "createdAt", "id", "name", "reply", "status") SELECT "authorEmail", "contact", "content", "createdAt", "id", "name", "reply", "status" FROM "Complaint";
DROP TABLE "Complaint";
ALTER TABLE "new_Complaint" RENAME TO "Complaint";
CREATE INDEX "Complaint_createdAt_idx" ON "Complaint"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
