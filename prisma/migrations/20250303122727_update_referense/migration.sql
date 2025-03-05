/*
  Warnings:

  - The values [PENDING,APPROVED,REJECTED] on the enum `EStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `tickets_count` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `total_tickets` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `user_id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Reservation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `places` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `places` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EStatus_new" AS ENUM ('INTERNAL', 'EVERYONE');
ALTER TABLE "Application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "status" TYPE "EStatus_new" USING ("status"::text::"EStatus_new");
ALTER TYPE "EStatus" RENAME TO "EStatus_old";
ALTER TYPE "EStatus_new" RENAME TO "EStatus";
DROP TYPE "EStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_userId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_userId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "status",
DROP COLUMN "tickets_count",
ADD COLUMN     "places" INTEGER NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "total_tickets",
ADD COLUMN     "places" INTEGER NOT NULL,
ADD COLUMN     "status" "EStatus" NOT NULL DEFAULT 'EVERYONE';

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- DropTable
DROP TABLE "Reservation";

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
