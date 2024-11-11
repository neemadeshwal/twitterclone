/*
  Warnings:

  - You are about to drop the column `repostParentId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `repostParentId` on the `Tweet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_repostParentId_fkey";

-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_repostParentId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "repostParentId";

-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "repostParentId";

-- CreateTable
CREATE TABLE "Repost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tweetId" TEXT,
    "commentId" TEXT,

    CONSTRAINT "Repost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Repost_userId_tweetId_key" ON "Repost"("userId", "tweetId");

-- CreateIndex
CREATE UNIQUE INDEX "Repost_userId_commentId_key" ON "Repost"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "Repost" ADD CONSTRAINT "Repost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repost" ADD CONSTRAINT "Repost_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repost" ADD CONSTRAINT "Repost_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
