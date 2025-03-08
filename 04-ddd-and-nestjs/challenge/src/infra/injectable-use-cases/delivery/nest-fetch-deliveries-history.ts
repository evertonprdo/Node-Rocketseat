import { Injectable } from '@nestjs/common'

import { FetchDeliveriesHistoryUseCase } from '@/domain/delivery/use-cases/fetch-deliveries-history.use-case'

import { PrismaDeliveriesRepository } from '@/infra/database/prisma/delivery/repositories/prisma-deliveries.repository'

@Injectable()
export class NestFetchDeliveriesHistoryUseCase extends FetchDeliveriesHistoryUseCase {
  constructor(deliveriesRepository: PrismaDeliveriesRepository) {
    super(deliveriesRepository)
  }
}
