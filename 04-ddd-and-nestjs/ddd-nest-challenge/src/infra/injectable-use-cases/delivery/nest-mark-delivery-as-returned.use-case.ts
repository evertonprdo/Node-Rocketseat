import { Injectable } from '@nestjs/common'

import { MarkDeliveryAsReturned } from '@/domain/delivery/use-cases/mark-delivery-as-returned.use-case'

import { PrismaDeliveriesRepository } from '@/infra/database/prisma/delivery/repositories/prisma-deliveries.repository'

@Injectable()
export class NestMarkDeliveryAsReturnedUseCase extends MarkDeliveryAsReturned {
  constructor(deliveriesRepository: PrismaDeliveriesRepository) {
    super(deliveriesRepository)
  }
}
