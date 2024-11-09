import { Either, right } from '@/core/either'

import { Notification } from '../entities/notification'
import { NotificationsRepository } from '../repositories/notifications.repository'

interface FetchRecipientNotificationUseCaseRequest {
  recipientId: string
  unreadyOnly: boolean
  page: number
}

type FetchRecipientNotificationUseCaseResponse = Either<
  null,
  { notifications: Notification[] }
>

export class FetchRecipientNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    unreadyOnly,
    page,
  }: FetchRecipientNotificationUseCaseRequest): Promise<FetchRecipientNotificationUseCaseResponse> {
    const notifications =
      await this.notificationsRepository.findManyByRecipientId({
        recipientId,
        unreadyOnly,
        page,
      })

    return right({
      notifications,
    })
  }
}
