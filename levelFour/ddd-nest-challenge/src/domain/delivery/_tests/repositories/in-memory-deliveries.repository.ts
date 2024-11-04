import { DomainEvents } from '@/core/events/domain-events'

import { InMemoryReceiversRepository } from './in-memory-receivers.repository'
import { InMemoryDeliveryWorkersRepository } from './in-memory-delivery-workers.repository'

import { Delivery } from '../../entities/delivery'

import {
  DeliveriesRepository,
  FindManyPendingByCity,
} from '../../repositories/deliveries.repository'
import { InMemoryDeliveryAttachmentsRepository } from '@/domain/_shared/_tests/repositores/in-memory-delivery-attachments.repository'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = []

  constructor(
    public deliveryWorkersRepository: InMemoryDeliveryWorkersRepository,
    public receiversRepository: InMemoryReceiversRepository,
    public deliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository,
  ) {}

  async findById(id: string) {
    const delivery = this.items.find((item) => item.id.toString() === id)

    if (!delivery) {
      return null
    }

    return delivery
  }

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

  async save(delivery: Delivery) {
    const itemIndex = this.items.findIndex((item) => item.id === delivery.id)

    if (
      !this.items[itemIndex].deliveryAttachment &&
      delivery.deliveryAttachment
    ) {
      await this.deliveryAttachmentsRepository.create(
        delivery.deliveryAttachment,
      )
    }

    this.items[itemIndex] = delivery

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }
}
