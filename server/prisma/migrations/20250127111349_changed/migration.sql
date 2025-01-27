/*
  Warnings:

  - You are about to drop the column `photoArray` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `videoArray` on the `Tweet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "photoArray",
DROP COLUMN "videoArray",
ADD COLUMN     "mediaArray" TEXT[];
