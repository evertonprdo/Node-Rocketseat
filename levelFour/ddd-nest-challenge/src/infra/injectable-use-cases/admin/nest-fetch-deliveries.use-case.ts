import { Injectable } from '@nestjs/common'

import { FetchDeliveriesUseCase } from '@/domain/admin/use-cases/fetch-deliveries.use-case'

import { PrismaDeliveriesRepository } from '@/infra/database/prisma/admin/repositories/prisma-deliveries.repository'

@Injectable()
export class NestFetchDeliveriesUseCase extends FetchDeliveriesUseCase {
  constructor(deliveriesRepository: PrismaDeliveriesRepository) {
    super(deliveriesRepository)
  }
}
