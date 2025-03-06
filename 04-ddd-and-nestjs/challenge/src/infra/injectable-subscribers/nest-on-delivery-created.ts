import { Injectable } from '@nestjs/common'

import { OnDeliveryCreated } from '@/domain/notification/subscribers/on-delivery-created'

import { PrismaCustomersRepository } from '../database/prisma/admin/repositories/prisma-customers.repository'
import { NestSendNotificationUseCase } from '../injectable-use-cases/notification/nest-send-notification.use-case'

@Injectable()
export class NestOnDeliveryCreated extends OnDeliveryCreated {
  constructor(
    customersRepository: PrismaCustomersRepository,
    sendNotification: NestSendNotificationUseCase,
  ) {
    super(customersRepository, sendNotification)
  }
}
