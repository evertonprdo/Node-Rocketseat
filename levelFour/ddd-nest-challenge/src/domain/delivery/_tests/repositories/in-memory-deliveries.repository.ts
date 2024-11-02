import { InMemoryReceiversRepository } from './in-memory-receivers.repository'
import { InMemoryDeliveryWorkersRepository } from './in-memory-delivery-workers.repository'

import { Delivery } from '../../entities/delivery'

import {
  DeliveriesRepository,
  FindManyPendingByCity,
} from '../../repositories/deliveries.repository'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = []

  constructor(
    public deliveryWorkersRepository: InMemoryDeliveryWorkersRepository,
    public receiversRepository: InMemoryReceiversRepository,
  ) {}

  async findManyPendingByCity({ page, city }: FindManyPendingByCity) {
    const deliveriesByCity = this.items.filter((item) => {
      const customer = this.receiversRepository.items.find(
        (customer) =>
          customer.id.equals(item.receiverId) && customer.address.city === city,
      )
      return customer !== undefined && item.status === 'PENDING'
    })

    const take = 20
    return deliveriesByCity.slice((page - 1) * take, page * take)
  }
}
