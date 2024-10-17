import { PaginationParams } from '@/core/repositories/pagination-params'
import { Delivery } from '../entities/delivery'

export interface DeliveriesRepository {
  findMany({ page }: PaginationParams): Promise<Delivery[]>
  findById(id: string): Promise<Delivery | null>
  create(delivery: Delivery): Promise<void>
  delete(delivery: Delivery): Promise<void>
}
