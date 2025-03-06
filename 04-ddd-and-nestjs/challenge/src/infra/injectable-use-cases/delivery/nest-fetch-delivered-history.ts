import { Injectable } from '@nestjs/common'

import { FetchDeliveredHistoryUseCase } from '@/domain/delivery/use-cases/fetch-delivered-history.use-case'

import { PrismaDeliveriesRepository } from '@/infra/database/prisma/delivery/repositories/prisma-deliveries.repository'

@Injectable()
export class NestFetchDeliveredHistoryUseCase extends FetchDeliveredHistoryUseCase {
  constructor(deliveriesRepository: PrismaDeliveriesRepository) {
    super(deliveriesRepository)
  }
}
