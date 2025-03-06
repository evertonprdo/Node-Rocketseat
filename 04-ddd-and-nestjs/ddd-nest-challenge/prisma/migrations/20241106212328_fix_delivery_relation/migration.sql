-- DropForeignKey
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_delivery_worker_id_fkey";

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_delivery_worker_id_fkey" FOREIGN KEY ("delivery_worker_id") REFERENCES "delivery_workers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
