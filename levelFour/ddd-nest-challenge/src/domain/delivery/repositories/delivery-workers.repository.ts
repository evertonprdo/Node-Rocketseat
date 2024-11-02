import { DeliveryWorker } from '../entities/delivery-worker'

export interface DeliveryWorkersRepository {
  findById(id: string): Promise<DeliveryWorker | null>
}
