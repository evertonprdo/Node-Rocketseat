import { Injectable } from '@nestjs/common'

import { FetchDeliveriesToDeliveryUseCase } from '@/domain/delivery/use-cases/fetch-deliveries-to-delivery.use-case'

import { PrismaDeliveriesRepository } from '@/infra/database/prisma/delivery/repositories/prisma-deliveries.repository'

@Injectable()
export class NestFetchDeliveriesToDeliveryUseCase extends FetchDeliveriesToDeliveryUseCase {
  constructor(deliveriesRepository: PrismaDeliveriesRepository) {
    super(deliveriesRepository)
  }
}
