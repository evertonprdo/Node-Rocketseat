import { DeliveryWorker } from '../entities/delivery-worker'

export interface DeliveryWorkersRepository {
  assign(deliveryWorker: DeliveryWorker): Promise<void>
}
