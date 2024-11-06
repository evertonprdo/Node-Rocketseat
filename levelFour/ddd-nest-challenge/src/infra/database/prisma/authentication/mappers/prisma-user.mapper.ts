import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CPF } from '@/domain/_shared/entities/value-objects/cpf'
import { User } from '@/domain/authentication/entities/user'

import {
  User as PrismaUser,
  Admin as PrismaAdmin,
  DeliveryWorker as PrismaDeliveryWorker,
} from '@prisma/client'

type PrismaUserAdminDeliveryWorkerProps = {
  admin: PrismaAdmin | null
  deliveryWorker: PrismaDeliveryWorker | null
} & PrismaUser

export class PrismaUserMapper {
  static toDomain(raw: PrismaUserAdminDeliveryWorkerProps): User {
    const adminId = raw.admin ? new UniqueEntityId(raw.admin.id) : null

    const deliveryWorkerId = raw.deliveryWorker
      ? new UniqueEntityId(raw.deliveryWorker.id)
      : null

    return User.create(
      {
        cpf: CPF.createFromText(raw.cpf),
        password: raw.password,
        adminId,
        deliveryWorkerId,
      },
      new UniqueEntityId(raw.id),
    )
  }
}
