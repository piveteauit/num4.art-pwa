/*
  Warnings:

  - You are about to drop the column `stripePriceId` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `stripeProductId` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "stripePriceId",
DROP COLUMN "stripeProductId";
