import { Module } from '@nestjs/common'

import { NotificationDatabaseModule } from '../database/prisma/notification/notification-database.module'

import { ReadNotificationController } from './controllers/notification/read-notification.controller'
import { NestReadNotificationUseCase } from '../injectable-use-cases/notification/nest-read-notification.use-case'

import { GetNotificationController } from './controllers/notification/get-notification.controller'
import { NestGetNotificationUseCase } from '../injectable-use-cases/notification/nest-get-notification.use-case'

import { FetchNotificationsController } from './controllers/notification/fetch-notifications.controller'
import { NestFetchRecipientNotificationsUseCase } from '../injectable-use-cases/notification/nest-fetch-recipient-notifications.use-case'

@Module({
  imports: [NotificationDatabaseModule],
  controllers: [
    ReadNotificationController,
    GetNotificationController,
    FetchNotificationsController,
  ],
  providers: [
    NestReadNotificationUseCase,
    NestGetNotificationUseCase,
    NestFetchRecipientNotificationsUseCase,
  ],
})
export class NotificationHttpModule {}
