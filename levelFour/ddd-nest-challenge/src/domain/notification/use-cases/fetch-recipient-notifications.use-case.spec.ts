import { makeNotification } from '../_test/factories/make-notification'
import { InMemoryNotificationsRepository } from '../_test/repositories/in-memory-notifications-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchRecipientNotificationUseCase } from './fetch-recipient-notifications.use-case'

let notificationRepository: InMemoryNotificationsRepository
let sut: FetchRecipientNotificationUseCase

describe('Fetch Recipient Notifications', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationsRepository()
    sut = new FetchRecipientNotificationUseCase(notificationRepository)
  })

  it('should fetch the recipient notifications', async () => {
    const recipientId = new UniqueEntityId()

    const notifications = Array.from({ length: 3 }, () =>
      makeNotification({ recipientId }),
    )

    notificationRepository.items.push(...notifications)

    const result = await sut.execute({
      recipientId: recipientId.toString(),
      unreadyOnly: false,
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.notifications).toHaveLength(3)
    expect(result.value?.notifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: notifications[0].id }),
        expect.objectContaining({ id: notifications[0].id }),
        expect.objectContaining({ id: notifications[0].id }),
      ]),
    )
  })

  it('should fetch the recipient notifications unready only', async () => {
    const recipientId = new UniqueEntityId()

    for (let i = 0; i < 3; i++) {
      const unreadyNotification = makeNotification({ recipientId })

      const readNotification = makeNotification({
        recipientId,
        readAt: new Date(),
      })

      notificationRepository.items.push(readNotification)
      notificationRepository.items.push(makeNotification(unreadyNotification))
    }

    const result = await sut.execute({
      recipientId: recipientId.toString(),
      unreadyOnly: true,
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.notifications).toHaveLength(3)

    expect(result.value).not.toMatchObject({
      readAt: expect.any(Date),
    })
  })
})
