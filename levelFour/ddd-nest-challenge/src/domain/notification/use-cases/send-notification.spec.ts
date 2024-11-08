import { InMemoryNotificationsRepository } from '../_test/repositories/in-memory-notifications-repository'

import { SendNotificationUseCase } from './send-notification'

let notificationRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'New Notification',
      content: 'Notification Content',
    })

    expect(result.isRight()).toBe(true)
    expect(notificationRepository.items[0]).toEqual(result.value?.notification)
  })
})
