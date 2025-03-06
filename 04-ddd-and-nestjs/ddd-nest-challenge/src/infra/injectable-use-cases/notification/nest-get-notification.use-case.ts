import { GetNotificationUseCase } from '@/domain/notification/use-cases/get-notification.use-case'
import { PrismaNotificationsRepository } from '@/infra/database/prisma/notification/repositories/prisma-notifications.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestGetNotificationUseCase extends GetNotificationUseCase {
  constructor(notificationsRepository: PrismaNotificationsRepository) {
    super(notificationsRepository)
  }
}
