import { Injectable } from '@nestjs/common'

import { UnassignDeliveryWorkerUseCase } from '@/domain/admin/use-cases/unassign-delivery-worker.use-case'
import { PrismaDeliveryWorkersRepository } from '@/infra/database/prisma/admin/repositories/prisma-delivery-workers.repository'

@Injectable()
export class NestUnassignDeliveryWorkerUseCase extends UnassignDeliveryWorkerUseCase {
  constructor(deliveryWorkersRepository: PrismaDeliveryWorkersRepository) {
    super(deliveryWorkersRepository)
  }
}
