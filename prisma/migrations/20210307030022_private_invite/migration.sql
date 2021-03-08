-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Paste" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Paste" ("id", "createdAt", "content", "userId") SELECT "id", "createdAt", "content", "userId" FROM "Paste";
DROP TABLE "Paste";
ALTER TABLE "new_Paste" RENAME TO "Paste";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "invited" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("id", "username", "password") SELECT "id", "username", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
