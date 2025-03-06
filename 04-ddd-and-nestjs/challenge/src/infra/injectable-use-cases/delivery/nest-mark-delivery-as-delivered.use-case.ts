import { Injectable } from '@nestjs/common'

import { MarkDeliveryAsDelivered } from '@/domain/delivery/use-cases/mark-delivery-as-delivered.use-case'

import { PrismaDeliveriesRepository } from '@/infra/database/prisma/delivery/repositories/prisma-deliveries.repository'

@Injectable()
export class NestMarkDeliveryAsDeliveredUseCase extends MarkDeliveryAsDelivered {
  constructor(deliveriesRepository: PrismaDeliveriesRepository) {
    super(deliveriesRepository)
  }
}
