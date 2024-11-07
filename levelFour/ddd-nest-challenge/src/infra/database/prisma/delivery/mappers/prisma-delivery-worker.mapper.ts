import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeliveryWorker } from '@/domain/delivery/entities/delivery-worker'

import { DeliveryWorker as PrismaDeliveryWorker } from '@prisma/client'

type PrismaDeliveryWorkerWithName = {
  user: {
    name: string
  }
} & PrismaDeliveryWorker

export class PrismaDeliveryWorkerMapper {
  static toDomain(raw: PrismaDeliveryWorkerWithName): DeliveryWorker {
    return DeliveryWorker.create(
      {
        name: raw.user.name,
        operationCity: raw.operationZone,
      },
      new UniqueEntityId(raw.id),
    )
  }
}
