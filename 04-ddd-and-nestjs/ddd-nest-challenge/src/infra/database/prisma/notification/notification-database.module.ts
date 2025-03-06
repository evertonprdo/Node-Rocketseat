import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { PrismaNotificationsRepository } from './repositories/prisma-notifications.repository'

@Module({
  exports: [PrismaService, PrismaNotificationsRepository],
  providers: [PrismaService, PrismaNotificationsRepository],
})
export class NotificationDatabaseModule {}
