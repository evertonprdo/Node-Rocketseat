import { Injectable } from '@nestjs/common'

import { PrismaCustomersRepository } from '../database/prisma/admin/repositories/prisma-customers.repository'
import { NestSendNotificationUseCase } from '../injectable-use-cases/notification/nest-send-notification.use-case'

import { OnDeliveryStatusUpdated } from '@/domain/notification/subscribers/on-delivery-status-updated'

@Injectable()
export class NestOnDeliveryStatusUpdated extends OnDeliveryStatusUpdated {
  constructor(
    customersRepository: PrismaCustomersRepository,
    sendNotification: NestSendNotificationUseCase,
  ) {
    super(customersRepository, sendNotification)
  }
}
