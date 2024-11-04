import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'
import { Delivery } from '../entities/delivery'

export interface FindManyPendingByCity extends PaginationParams {
  city: string
}

export interface DeliveriesRepository {
  findManyPendingByCity(city: FindManyPendingByCity): Promise<Delivery[]>
  findById(id: string): Promise<Delivery | null>
  save(delivery: Delivery): Promise<void>
}
