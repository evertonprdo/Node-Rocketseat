import { makeNotification } from '../_test/factories/make-notification'
import { InMemoryNotificationsRepository } from '../_test/repositories/in-memory-notifications-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { NotAllowedError } from '@/domain/_shared/errors/not-allowed-error'

import { GetNotificationUseCase } from './get-notification.use-case'

let notificationRepository: InMemoryNotificationsRepository
let sut: GetNotificationUseCase

describe('Get Notification', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationsRepository()
    sut = new GetNotificationUseCase(notificationRepository)
  })

  it('should be able to get a notification', async () => {
    const notification = makeNotification()

    await notificationRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      notification: notificationRepository.items[0],
    })
  })

  it('should not be able to get a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-1'),
    })

    await notificationRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
