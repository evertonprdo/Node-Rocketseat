import { Injectable } from '@nestjs/common'

import { PrismaDeliveriesRepository } from '@/infra/database/prisma/delivery/repositories/prisma-deliveries.repository'
import { PrismaDeliveryWorkersRepository } from '@/infra/database/prisma/delivery/repositories/prisma-delivery-workers.repository'

import { FetchPendingDeliveriesNearbyUseCase } from '@/domain/delivery/use-cases/fetch-pending-deliveries-nearby.use-case'

@Injectable()
export class NestFetchPendingDeliveriesNearbyUseCase extends FetchPendingDeliveriesNearbyUseCase {
  constructor(
    deliveriesRepository: PrismaDeliveriesRepository,
    deliveryWorkersRepository: PrismaDeliveryWorkersRepository,
  ) {
    super(deliveriesRepository, deliveryWorkersRepository)
  }
}
