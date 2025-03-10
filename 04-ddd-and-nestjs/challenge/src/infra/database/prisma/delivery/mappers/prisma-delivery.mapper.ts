import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Delivery } from '@/domain/delivery/entities/delivery'
import { DeliveryAttachment } from '@/domain/_shared/entities/value-objects/delivery-attachment'

import { Prisma, Delivery as PrismaDelivery } from '@prisma/client'

export class PrismaDeliveryMapper {
  static toDomain(raw: PrismaDelivery): Delivery {
    const attachment = raw.attachmentId
      ? DeliveryAttachment.create({
          deliveryId: new UniqueEntityId(raw.id),
          attachmentId: new UniqueEntityId(raw.attachmentId),
        })
      : null

    const deliveryWorkerId = raw.deliveryWorkerId
      ? new UniqueEntityId(raw.deliveryWorkerId)
      : null

    return Delivery.create(
      {
        status: raw.status,
        receiverId: new UniqueEntityId(raw.customerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        pickedUpAt: raw.pickedUpAt,
        deliveryWorkerId,
        deliveredAt: raw.deliveredAt,
        attachment,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(delivery: Delivery): Prisma.DeliveryUncheckedCreateInput {
    return {
      id: delivery.id.toString(),
      status: delivery.status,
      customerId: delivery.receiverId.toString(),
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
      pickedUpAt: delivery.pickedUpAt,
      deliveryWorkerId: delivery.deliveryWorkerId?.toString(),
      deliveredAt: delivery.deliveredAt,
      attachmentId: delivery.attachment?.attachmentId.toString(),
    }
  }
}
