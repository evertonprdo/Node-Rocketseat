import { MockInstance } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { makeReceiver } from '@/domain/delivery/_tests/factories/make-receiver'
import { makeDelivery } from '@/domain/delivery/_tests/factories/make-delivery'

import { makeInMemoryDeliveriesRepository } from '@/domain/delivery/_tests/repositories/factories/make-in-memory-deliveries.repository'
import { makeInMemoryReceiversRepository } from '@/domain/delivery/_tests/repositories/factories/make-in-memory-receivers.repository'

import { InMemoryNotificationsRepository } from '../_test/repositories/in-memory-notifications-repository'
import { InMemoryReceiversRepository } from '@/domain/delivery/_tests/repositories/in-memory-receivers.repository'
import { InMemoryDeliveriesRepository } from '@/domain/delivery/_tests/repositories/in-memory-deliveries.repository'

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification.use-case'

import { OnDeliveryStatusUpdated } from './on-delivery-status-updated'

let receiversRepository: InMemoryReceiversRepository
let deliveriesRepository: InMemoryDeliveriesRepository
let notificationsRepository: InMemoryNotificationsRepository

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

let sendNotificationUseCase: SendNotificationUseCase

describe('On Delivery Status Updated', () => {
  beforeEach(() => {
    receiversRepository = makeInMemoryReceiversRepository()
    deliveriesRepository = makeInMemoryDeliveriesRepository()
    notificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnDeliveryStatusUpdated(receiversRepository, sendNotificationUseCase)
  })

  it('should send a notification when a delivery status updated', async () => {
    const receiver = makeReceiver()
    const delivery = makeDelivery({
      receiverId: receiver.id,
    })

    delivery.markAsPickedUp(new UniqueEntityId())

    receiversRepository.items.push(receiver)
    deliveriesRepository.save(delivery)

    await vi.waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
