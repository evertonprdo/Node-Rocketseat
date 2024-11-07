import { DomainEvents } from '@/core/events/domain-events'

import { InMemoryReceiversRepository } from './in-memory-receivers.repository'
import { InMemoryDeliveryWorkersRepository } from './in-memory-delivery-workers.repository'

import { Delivery } from '../../entities/delivery'
import { DeliveryDetails } from '../../entities/value-objects/delivery-details'

import {
  DeliveriesRepository,
  findManyDeliveredByDeliveryWorkerId,
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

  async findDetailsById(id: string) {
    const delivery = this.items.find((item) => item.id.toString() === id)

    if (!delivery) {
      return null
    }

    const customer = await this.receiversRepository.findById(
      delivery.receiverId.toString(),
    )

    if (!customer) {
      throw new Error()
    }

    return DeliveryDetails.create({
      deliveryId: delivery.id,
      status: delivery.status,
      createdAt: delivery.createdAt,
      pickedUpAt: delivery.pickedUpAt,
      deliveredAt: delivery.deliveredAt,
      attachment: delivery.attachment,
      updatedAt: delivery.updatedAt,

      receiver: {
        id: customer.id,
        name: customer.name,
        address: customer.address,
      },
    })
  }

  async findManyDeliveredByDeliveryWorkerId({
    deliveryWorkerId,
    page,
  }: findManyDeliveredByDeliveryWorkerId) {
    const deliveries = this.items.filter(
      (item) =>
        item.status === 'DELIVERED' &&
        item.deliveryWorkerId?.toString() === deliveryWorkerId,
    )

    const take = 20
    return deliveries.slice((page - 1) * take, page * take)
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
      !this.items[itemIndex].attachment &&
      delivery.attachment
    ) {
      await this.deliveryAttachmentsRepository.create(
        delivery.attachment,
      )
    }

    this.items[itemIndex] = delivery

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }
}
