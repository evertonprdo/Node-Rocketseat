import { Injectable } from '@nestjs/common'

import { GetDeliveryDetailsUseCase } from '@/domain/delivery/use-cases/get-delivery-details.use-case'

import { PrismaDeliveriesRepository } from '@/infra/database/prisma/delivery/repositories/prisma-deliveries.repository'

@Injectable()
export class NestGetDeliveryDetailsUseCase extends GetDeliveryDetailsUseCase {
  constructor(deliveriesRepository: PrismaDeliveriesRepository) {
    super(deliveriesRepository)
  }
}
