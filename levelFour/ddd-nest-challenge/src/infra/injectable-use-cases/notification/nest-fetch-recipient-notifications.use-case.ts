import { Injectable } from '@nestjs/common'

import { FetchRecipientNotificationUseCase } from '@/domain/notification/use-cases/fetch-recipient-notifications.use-case'
import { PrismaNotificationsRepository } from '@/infra/database/prisma/notification/repositories/prisma-notifications.repository'

@Injectable()
export class NestFetchRecipientNotificationsUseCase extends FetchRecipientNotificationUseCase {
  constructor(notificationsRepository: PrismaNotificationsRepository) {
    super(notificationsRepository)
  }
}
