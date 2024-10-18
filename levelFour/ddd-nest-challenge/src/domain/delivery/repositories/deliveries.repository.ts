import { PaginationParams } from '@/core/repositories/pagination-params'
import { Delivery } from '../entities/delivery'
import { DeliveryWithCustomer } from '../entities/value-objects/delivery-with-customer'

export interface DeliveriesRepository {
  findMany({ page }: PaginationParams): Promise<Delivery[]>
  findByIdWithCustomer(id: string): Promise<DeliveryWithCustomer | null>
  findById(id: string): Promise<Delivery | null>
  create(delivery: Delivery): Promise<void>
  save(delivery: Delivery): Promise<void>
  delete(delivery: Delivery): Promise<void>
}
