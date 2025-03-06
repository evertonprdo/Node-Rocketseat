import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

import { PrismaReceiversRepository } from './repositories/prisma-receivers.repository'
import { PrismaDeliveriesRepository } from './repositories/prisma-deliveries.repository'
import { PrismaAttachmentsRepository } from './repositories/prisma-attachments.repository'
import { PrismaDeliveryWorkersRepository } from './repositories/prisma-delivery-workers.repository'

@Module({
  providers: [
    PrismaService,
    PrismaReceiversRepository,
    PrismaDeliveriesRepository,
    PrismaDeliveryWorkersRepository,
    PrismaAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaReceiversRepository,
    PrismaDeliveriesRepository,
    PrismaDeliveryWorkersRepository,
    PrismaAttachmentsRepository,
  ],
})
export class DeliveryDatabaseModule {}
