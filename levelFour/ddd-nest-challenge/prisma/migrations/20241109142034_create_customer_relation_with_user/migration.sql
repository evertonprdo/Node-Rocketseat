/*
  Warnings:

  - You are about to drop the column `name` on the `customers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "name",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customers_user_id_key" ON "customers"("user_id");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
