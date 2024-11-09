import { Module } from '@nestjs/common'

import { AdminDatabaseModule } from '../database/prisma/admin/admin-database.module'
import { DeliveryDatabaseModule } from '../database/prisma/delivery/delivery-database.module'
import { NotificationDatabaseModule } from '../database/prisma/notification/notification-database.module'

import { NestOnDeliveryCreated } from '../injectable-subscribers/nest-on-delivery-created'
import { NestSendNotificationUseCase } from '../injectable-use-cases/notification/nest-send-notification.use-case'
import { NestOnDeliveryStatusUpdated } from '../injectable-subscribers/nest-on-delivery-status-updated'

@Module({
  imports: [
    AdminDatabaseModule,
    DeliveryDatabaseModule,
    NotificationDatabaseModule,
  ],
  providers: [
    NestOnDeliveryCreated,
    NestSendNotificationUseCase,
    NestOnDeliveryStatusUpdated,
  ],
})
export class EventsModule {}
