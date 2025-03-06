import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import {
  User as PrismaUser,
  DeliveryWorker as PrismaDeliveryWorker,
} from '@prisma/client'

import { CPF } from '@/domain/_shared/entities/value-objects/cpf'
import { DeliveryWorkerDetails } from '@/domain/admin/entities/values-objects/delivery-worker-details'

type PrismaDeliveryWorkerWithUser = {
  user: PrismaUser
} & PrismaDeliveryWorker

export class PrismaDeliveryWorkerDetailsMapper {
  static toDomain(raw: PrismaDeliveryWorkerWithUser): DeliveryWorkerDetails {
    return DeliveryWorkerDetails.create({
      deliveryWorkerId: new UniqueEntityId(raw.id),
      userId: new UniqueEntityId(raw.user.id),
      operationZone: raw.operationZone,
      cpf: CPF.createFromText(raw.user.cpf),
      name: raw.user.name,
      phone: raw.user.phone,
    })
  }
}
