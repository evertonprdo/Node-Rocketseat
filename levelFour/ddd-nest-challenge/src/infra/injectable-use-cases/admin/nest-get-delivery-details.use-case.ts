import { Injectable } from '@nestjs/common'

import { GetDeliveryDetailsUseCase } from '@/domain/admin/use-cases/get-delivery-details.use-case'

import { PrismaDeliveriesRepository } from '@/infra/database/prisma/admin/repositories/prisma-deliveries.repository'

@Injectable()
export class NestGetDeliveryDetailsUseCase extends GetDeliveryDetailsUseCase {
  constructor(deliveriesRepository: PrismaDeliveriesRepository) {
    super(deliveriesRepository)
  }
}
