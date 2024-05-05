/*
  Warnings:

  - A unique constraint covering the columns `[expires]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[expires,token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- DropIndex
DROP INDEX "VerificationToken_token_key";

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_expires_key" ON "VerificationToken"("expires");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_expires_token_key" ON "VerificationToken"("expires", "token");
