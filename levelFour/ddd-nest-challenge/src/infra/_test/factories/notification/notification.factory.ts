import { Injectable } from '@nestjs/common'

import { makeNotification } from '@/domain/notification/_test/factories/make-notification'
import { NotificationProps } from '@/domain/notification/entities/notification'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaNotificationMapper } from '@/infra/database/prisma/notification/mappers/prisma-notification.mapper'

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(data: Partial<NotificationProps> = {}) {
    const notification = makeNotification(data)

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    })

    return notification
  }
}
