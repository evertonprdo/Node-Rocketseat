import { PaginationParams } from '@/core/repositories/pagination-params'
import { Delivery } from '../entities/delivery'
import { DeliveryWithCustomer } from '../entities/value-objects/delivery-with-customer'

export type FindManyByCourierIdProps = {
  courierId: string
} & PaginationParams

export interface DeliveriesRepository {
  findManyPendingByCity(city: string): Promise<Delivery[]>
  findMany({ page }: PaginationParams): Promise<Delivery[]>
  findByIdWithCustomer(id: string): Promise<DeliveryWithCustomer | null>
  findManyByCourierId(props: FindManyByCourierIdProps): Promise<Delivery[]>
  findById(id: string): Promise<Delivery | null>
  create(delivery: Delivery): Promise<void>
  save(delivery: Delivery): Promise<void>
  delete(delivery: Delivery): Promise<void>
}
