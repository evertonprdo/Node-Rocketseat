import { Injectable } from '@nestjs/common'

import { PrismaUsersRepository } from '@/infra/database/prisma/admin/repositories/prisma-users.repository'
import { PrismaDeliveryWorkersRepository } from '@/infra/database/prisma/admin/repositories/prisma-delivery-workers.repository'

import { AssignDeliveryWorkerUseCase } from '@/domain/admin/use-cases/assign-delivery-worker.use-case'

@Injectable()
export class NestAssignDeliveryWorkerUseCase extends AssignDeliveryWorkerUseCase {
  constructor(
    usersRepository: PrismaUsersRepository,
    deliveryWorkersRepository: PrismaDeliveryWorkersRepository,
  ) {
    super(usersRepository, deliveryWorkersRepository)
  }
}
