/*
  Warnings:

  - You are about to drop the column `userId` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `operationCity` on the `delivery_workers` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `delivery_workers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `delivery_workers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operation_zone` to the `delivery_workers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `delivery_workers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_delivery_worker_id_fkey";

-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_userId_fkey";

-- DropForeignKey
ALTER TABLE "delivery_workers" DROP CONSTRAINT "delivery_workers_userId_fkey";

-- DropIndex
DROP INDEX "admins_userId_key";

-- DropIndex
DROP INDEX "delivery_workers_userId_key";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "delivery_workers" DROP COLUMN "operationCity",
DROP COLUMN "userId",
ADD COLUMN     "operation_zone" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_workers_user_id_key" ON "delivery_workers"("user_id");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_workers" ADD CONSTRAINT "delivery_workers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_delivery_worker_id_fkey" FOREIGN KEY ("delivery_worker_id") REFERENCES "delivery_workers"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
