import { Injectable } from '@nestjs/common'

import { CreateDeliveryUseCase } from '@/domain/admin/use-cases/create-delivery.use-case'

import { PrismaCustomersRepository } from '@/infra/database/prisma/admin/repositories/prisma-customers.repository'
import { PrismaDeliveriesRepository } from '@/infra/database/prisma/admin/repositories/prisma-deliveries.repository'

@Injectable()
export class NestCreateDeliveryUseCase extends CreateDeliveryUseCase {
  constructor(
    customersRepository: PrismaCustomersRepository,
    deliveriesRepository: PrismaDeliveriesRepository,
  ) {
    super(deliveriesRepository, customersRepository)
  }
}
