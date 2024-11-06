import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Delivery } from '@/domain/admin/entities/delivery'
import { Prisma, Delivery as PrismaDelivery } from '@prisma/client'

export class PrismaDeliveryMapper {
  static toDomain(raw: PrismaDelivery): Delivery {
    const deliveryWorkerId = raw.deliveryWorkerId
      ? new UniqueEntityId(raw.deliveryWorkerId)
      : null

    return Delivery.create(
      {
        customerId: new UniqueEntityId(raw.customerId),
        createdAt: raw.createdAt,
        deliveryWorkerId,
        status: raw.status,
        deliveredAt: raw.deliveredAt,
        pickedUpAt: raw.pickedUpAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(delivery: Delivery): Prisma.DeliveryUncheckedCreateInput {
    const deliveryWorkerId = delivery.deliveryWorkerId
      ? delivery.deliveryWorkerId.toString()
      : null

    return {
      id: delivery.id.toString(),
      customerId: delivery.customerId.toString(),
      deliveryWorkerId,
      status: delivery.status,
      createdAt: delivery.createdAt,
      deliveredAt: delivery.deliveredAt,
      pickedUpAt: delivery.pickedUpAt,
      updatedAt: delivery.updatedAt,
    }
  }
}
