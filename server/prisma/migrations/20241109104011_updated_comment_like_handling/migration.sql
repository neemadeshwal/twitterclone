/*
  Warnings:

  - A unique constraint covering the columns `[userId,commentId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_tweetId_fkey";

-- DropIndex
DROP INDEX "Like_commentId_key";

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "tweetId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_commentId_key" ON "Like"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
