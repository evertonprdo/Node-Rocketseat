import { Injectable } from '@nestjs/common'

import { PrismaNotificationsRepository } from '@/infra/database/prisma/notification/repositories/prisma-notifications.repository'

import { SendNotificationUseCase } from '@/domain/notification/use-cases/send-notification'

@Injectable()
export class NestSendNotificationUseCase extends SendNotificationUseCase {
  constructor(notificationsRepository: PrismaNotificationsRepository) {
    super(notificationsRepository)
  }
}
