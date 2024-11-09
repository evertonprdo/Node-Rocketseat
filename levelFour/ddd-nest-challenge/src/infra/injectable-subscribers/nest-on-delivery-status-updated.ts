import { Injectable } from '@nestjs/common'

import { PrismaReceiversRepository } from '../database/prisma/delivery/repositories/prisma-receivers.repository'
import { NestSendNotificationUseCase } from '../injectable-use-cases/notification/nest-send-notification.use-case'

import { OnDeliveryStatusUpdated } from '@/domain/notification/subscribers/on-delivery-status-updated'

@Injectable()
export class NestOnDeliveryStatusUpdated extends OnDeliveryStatusUpdated {
  constructor(
    receiversRepository: PrismaReceiversRepository,
    sendNotification: NestSendNotificationUseCase,
  ) {
    super(receiversRepository, sendNotification)
  }
}
