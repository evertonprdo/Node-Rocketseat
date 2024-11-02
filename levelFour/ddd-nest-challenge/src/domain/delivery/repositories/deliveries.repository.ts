import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'
import { Delivery } from '../entities/delivery'

export interface FindManyPendingByCity extends PaginationParams {
  city: string
}

export interface DeliveriesRepository {
  findManyPendingByCity(city: FindManyPendingByCity): Promise<Delivery[]>
}
