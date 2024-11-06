import { Injectable } from '@nestjs/common'

import { EditDeliveryWorkerUseCase } from '@/domain/admin/use-cases/edit-delivery-worker.use-case'
import { PrismaDeliveryWorkersRepository } from '@/infra/database/prisma/admin/repositories/prisma-delivery-workers.repository'

@Injectable()
export class NestEditDeliveryWorkerUseCase extends EditDeliveryWorkerUseCase {
  constructor(deliveryWorkersRepository: PrismaDeliveryWorkersRepository) {
    super(deliveryWorkersRepository)
  }
}
