import { Delivery } from '../entities/delivery'

export interface DeliveriesRepository {
  create(delivery: Delivery): Promise<void>
}
