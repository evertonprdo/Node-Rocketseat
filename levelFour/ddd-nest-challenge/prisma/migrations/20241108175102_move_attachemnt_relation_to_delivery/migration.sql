/*
  Warnings:

  - You are about to drop the column `delivery_id` on the `attachments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[attachment_id]` on the table `deliveries` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_delivery_id_fkey";

-- DropIndex
DROP INDEX "attachments_delivery_id_key";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "delivery_id";

-- AlterTable
ALTER TABLE "deliveries" ADD COLUMN     "attachment_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "deliveries_attachment_id_key" ON "deliveries"("attachment_id");

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
