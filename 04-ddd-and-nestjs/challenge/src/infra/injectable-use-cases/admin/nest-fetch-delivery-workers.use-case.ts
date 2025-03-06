import { Injectable } from '@nestjs/common'

import { FetchDeliveryWorkersUseCase } from '@/domain/admin/use-cases/fetch-delivery-workers.use-case'
import { PrismaDeliveryWorkersRepository } from '@/infra/database/prisma/admin/repositories/prisma-delivery-workers.repository'

@Injectable()
export class NestFetchDeliveryWorkersUseCase extends FetchDeliveryWorkersUseCase {
  constructor(deliveryWorkersRepository: PrismaDeliveryWorkersRepository) {
    super(deliveryWorkersRepository)
  }
}
