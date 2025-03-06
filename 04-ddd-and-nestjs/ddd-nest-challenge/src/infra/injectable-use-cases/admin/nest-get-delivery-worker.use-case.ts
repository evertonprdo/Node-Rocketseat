import { Injectable } from '@nestjs/common'

import { PrismaDeliveryWorkersRepository } from '@/infra/database/prisma/admin/repositories/prisma-delivery-workers.repository'

import { GetDeliveryWorkerUseCase } from '@/domain/admin/use-cases/get-delivery-worker.use-case'

@Injectable()
export class NestGetDeliveryWorkerUseCase extends GetDeliveryWorkerUseCase {
  constructor(deliveryWorkersRepository: PrismaDeliveryWorkersRepository) {
    super(deliveryWorkersRepository)
  }
}
