import { Either, left, right } from '@/core/either'

import { Notification } from '../entities/notification'
import { NotificationsRepository } from '../repositories/notifications.repository'

import { NotAllowedError } from '@/domain/_shared/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

interface GetNotificationUseCaseRequest {
  notificationId: string
  recipientId: string
}

type GetNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>

export class GetNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    notificationId,
    recipientId,
  }: GetNotificationUseCaseRequest): Promise<GetNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError())
    }

    return right({
      notification,
    })
  }
}
