import { Delivery } from '../../entities/delivery'
import { DeliveriesRepository } from '../../repositories/deliveries.repository'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = []

  async create(delivery: Delivery) {
    this.items.push(delivery)
  }
}
