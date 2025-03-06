import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeliveryWorker } from '@/domain/admin/entities/delivery-worker'
import { Prisma, DeliveryWorker as PrismaDeliveryWorker } from '@prisma/client'

export class PrismaDeliveryWorkerMapper {
  static toDomain(raw: PrismaDeliveryWorker): DeliveryWorker {
    return DeliveryWorker.create(
      {
        userId: new UniqueEntityId(raw.userId),
        operationZone: raw.operationZone,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    deliveryWorker: DeliveryWorker,
  ): Prisma.DeliveryWorkerUncheckedCreateInput {
    return {
      id: deliveryWorker.id.toString(),
      userId: deliveryWorker.userId.toString(),
      operationZone: deliveryWorker.operationZone,
    }
  }
}
