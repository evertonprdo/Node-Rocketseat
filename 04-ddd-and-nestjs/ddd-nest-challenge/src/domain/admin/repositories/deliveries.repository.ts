import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'
import { Delivery } from '../entities/delivery'
import { DeliveryDetails } from '../entities/values-objects/delivery-details'

export interface DeliveriesRepository {
  findById(id: string): Promise<Delivery | null>
  findDetailsById(id: string): Promise<DeliveryDetails | null>
  findMany(params: PaginationParams): Promise<Delivery[]>
  create(delivery: Delivery): Promise<void>
  delete(delivery: Delivery): Promise<void>
}
