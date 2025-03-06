import { Injectable } from '@nestjs/common'

import { DeleteDeliveryUseCase } from '@/domain/admin/use-cases/delete-delivery.use-case'

import { PrismaDeliveriesRepository } from '@/infra/database/prisma/admin/repositories/prisma-deliveries.repository'

@Injectable()
export class NestDeleteDeliveryUseCase extends DeleteDeliveryUseCase {
  constructor(deliveriesRepository: PrismaDeliveriesRepository) {
    super(deliveriesRepository)
  }
}
