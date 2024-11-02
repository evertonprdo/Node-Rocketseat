import { Delivery } from '../entities/delivery'
import { DeliveryDetails } from '../entities/values-objects/delivery-details'

export interface DeliveriesRepository {
  findDetailsById(id: string): Promise<DeliveryDetails | null>
  create(delivery: Delivery): Promise<void>
}
