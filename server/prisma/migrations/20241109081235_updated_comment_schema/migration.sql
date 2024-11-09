/*
  Warnings:

  - A unique constraint covering the columns `[userId,tweetId,commentId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Like_userId_tweetId_key";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "commentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_tweetId_commentId_key" ON "Like"("userId", "tweetId", "commentId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
