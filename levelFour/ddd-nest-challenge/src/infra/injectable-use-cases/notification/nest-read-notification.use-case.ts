import { Injectable } from '@nestjs/common'

import { PrismaNotificationsRepository } from '@/infra/database/prisma/notification/repositories/prisma-notifications.repository'

import { ReadNotificationUseCase } from '@/domain/notification/use-cases/read-notification.use-case'

@Injectable()
export class NestReadNotificationUseCase extends ReadNotificationUseCase {
  constructor(notificationsRepository: PrismaNotificationsRepository) {
    super(notificationsRepository)
  }
}
