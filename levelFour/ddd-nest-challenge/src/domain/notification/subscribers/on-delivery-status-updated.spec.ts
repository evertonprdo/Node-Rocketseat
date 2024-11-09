import { MockInstance } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { makeDelivery } from '@/domain/delivery/_tests/factories/make-delivery'

import { makeInMemoryCustomersRepository } from '@/domain/admin/_tests/repositories/factories/make-in-memory-customers-repository'
import { makeInMemoryDeliveriesRepository } from '@/domain/delivery/_tests/repositories/factories/make-in-memory-deliveries.repository'

import { InMemoryNotificationsRepository } from '../_test/repositories/in-memory-notifications-repository'
import { InMemoryCustomersRepository } from '@/domain/admin/_tests/repositories/in-memory-customers.repository'
import { InMemoryDeliveriesRepository } from '@/domain/delivery/_tests/repositories/in-memory-deliveries.repository'

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'

import { OnDeliveryStatusUpdated } from './on-delivery-status-updated'
import { makeCustomer } from '@/domain/admin/_tests/factories/make-customer'

let customersRepository: InMemoryCustomersRepository
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
    customersRepository = makeInMemoryCustomersRepository()
    deliveriesRepository = makeInMemoryDeliveriesRepository()
    notificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnDeliveryStatusUpdated(customersRepository, sendNotificationUseCase)
  })

  it('should send a notification when a delivery status updated', async () => {
    const customer = makeCustomer()
    const delivery = makeDelivery({
      receiverId: customer.id,
    })

    delivery.markAsPickedUp(new UniqueEntityId())

    customersRepository.items.push(customer)
    deliveriesRepository.save(delivery)

    await vi.waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
