/*
  Warnings:

  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `RoomUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authId,roomId]` on the table `RoomUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authId` to the `RoomUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoomUser" DROP CONSTRAINT "RoomUser_userId_fkey";

-- DropIndex
DROP INDEX "RoomUser_userId_roomId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "userId",
ADD COLUMN     "authId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RoomUser" DROP COLUMN "userId",
ADD COLUMN     "authId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RoomUser_authId_roomId_key" ON "RoomUser"("authId", "roomId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authId_fkey" FOREIGN KEY ("authId") REFERENCES "User"("authId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_authId_fkey" FOREIGN KEY ("authId") REFERENCES "User"("authId") ON DELETE RESTRICT ON UPDATE CASCADE;
