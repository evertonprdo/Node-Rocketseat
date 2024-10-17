import { PaginationParams } from '@/core/repositories/pagination-params'

import { Delivery } from '@/domain/delivery/entities/delivery'
import { DeliveriesRepository } from '@/domain/delivery/repositories/deliveries.repository'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = []

  async findMany({ page }: PaginationParams) {
    const take = 20

    const deliveries = this.items.slice((page - 1) * take, page * take)

    return deliveries
  }

  async findById(id: string) {
    const delivery = this.items.find((item) => item.id.toString() === id)

    if (!delivery) {
      return null
    }

    return delivery
  }

  async create(delivery: Delivery) {
    this.items.push(delivery)
  }

  async delete(delivery: Delivery) {
    const deliveryIndex = this.items.findIndex((item) =>
      item.id.equals(delivery.id),
    )

    this.items.splice(deliveryIndex, 1)
  }
}
