import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'
import { DeliveryWorker } from '../entities/delivery-worker'
import { DeliveryWorkerDetails } from '../entities/values-objects/delivery-worker-details'

export interface DeliveryWorkersRepository {
  findById(id: string): Promise<null | DeliveryWorker>
  findDetailsById(id: string): Promise<DeliveryWorkerDetails | null>
  findManyDetails(params: PaginationParams): Promise<DeliveryWorkerDetails[]>
  assign(deliveryWorker: DeliveryWorker): Promise<void>
  save(deliveryWorker: DeliveryWorker): Promise<void>
  unassign(deliveryWorker: DeliveryWorker): Promise<void>
}
