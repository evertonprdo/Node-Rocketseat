import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'

import { Delivery } from '../entities/delivery'
import { DeliveryDetails } from '../entities/value-objects/delivery-details'

export interface FindManyPendingByCity extends PaginationParams {
  city: string
}

export interface findManyDeliveredByDeliveryWorkerId extends PaginationParams {
  deliveryWorkerId: string
}

export interface DeliveriesRepository {
  findById(id: string): Promise<Delivery | null>
  findDetailsById(id: string): Promise<DeliveryDetails | null>

  findManyPendingByCity(params: FindManyPendingByCity): Promise<Delivery[]>

  findManyDeliveredByDeliveryWorkerId(
    params: findManyDeliveredByDeliveryWorkerId,
  ): Promise<Delivery[]>

  findManyPickedUpByDeliveryWorkerId(
    deliveryWorkerId: string,
  ): Promise<Delivery[]>

  save(delivery: Delivery): Promise<void>
}
