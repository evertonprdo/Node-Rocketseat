import { Injectable } from '@nestjs/common'

import { PrismaDeliveriesRepository } from '@/infra/database/prisma/delivery/repositories/prisma-deliveries.repository'
import { PrismaDeliveryWorkersRepository } from '@/infra/database/prisma/delivery/repositories/prisma-delivery-workers.repository'

import { MarkDeliveryAsPickedUp } from '@/domain/delivery/use-cases/mark-delivery-as-picked-up.use-case'

@Injectable()
export class NestMarkDeliveryAsPickedUpUseCase extends MarkDeliveryAsPickedUp {
  constructor(
    deliveriesRepository: PrismaDeliveriesRepository,
    deliveryWorkersRepository: PrismaDeliveryWorkersRepository,
  ) {
    super(deliveriesRepository, deliveryWorkersRepository)
  }
}
