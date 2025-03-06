import { DomainEvents } from '@/core/events/domain-events'

import { InMemoryReceiversRepository } from './in-memory-receivers.repository'
import { InMemoryDeliveryWorkersRepository } from './in-memory-delivery-workers.repository'
import { InMemoryAttachmentsRepository } from '@/domain/_shared/_tests/repositores/in-memory-attachments.repository'
import { InMemoryDeliveryAttachmentsRepository } from '@/domain/_shared/_tests/repositores/in-memory-delivery-attachments.repository'

import { Delivery } from '../../entities/delivery'
import { Attachment } from '@/domain/_shared/entities/attachment'
import { DeliveryDetails } from '../../entities/value-objects/delivery-details'

import {
  DeliveriesRepository,
  findManyDeliveredByDeliveryWorkerId,
  FindManyPendingByCity,
} from '../../repositories/deliveries.repository'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = []

  constructor(
    public deliveryWorkersRepository: InMemoryDeliveryWorkersRepository,
    public receiversRepository: InMemoryReceiversRepository,
    public deliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository,
    public attachmentsRepository: InMemoryAttachmentsRepository,
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

    let deliveryAttachment: Attachment | undefined

    if (delivery.attachment !== null && delivery.attachment !== undefined) {
      const attachment = delivery.attachment

      deliveryAttachment = this.attachmentsRepository.items.find((item) =>
        item.id.equals(attachment.attachmentId),
      )

      if (!deliveryAttachment) {
        throw new Error()
      }
    }

    const attachment = deliveryAttachment
      ? Attachment.create(
          {
            title: deliveryAttachment.title,
            url: deliveryAttachment.url,
          },
          deliveryAttachment.id,
        )
      : null

    return DeliveryDetails.create({
      deliveryId: delivery.id,
      status: delivery.status,
      createdAt: delivery.createdAt,
      pickedUpAt: delivery.pickedUpAt,
      deliveredAt: delivery.deliveredAt,
      updatedAt: delivery.updatedAt,
      attachment,

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

  async findManyPickedUpByDeliveryWorkerId(
    deliveryWorkerId: string,
  ): Promise<Delivery[]> {
    const deliveries = this.items.filter(
      (item) =>
        item.status === 'PICKED_UP' &&
        item.deliveryWorkerId?.toString() === deliveryWorkerId,
    )

    return deliveries
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

    this.items[itemIndex] = delivery

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }
}
