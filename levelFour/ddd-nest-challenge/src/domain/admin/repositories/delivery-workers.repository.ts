import { DeliveryWorker } from '../entities/delivery-worker'

export interface DeliveryWorkersRepository {
  findById(id: string): Promise<null | DeliveryWorker>
  assign(deliveryWorker: DeliveryWorker): Promise<void>
}
