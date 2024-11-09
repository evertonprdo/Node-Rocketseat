import { MockInstance } from 'vitest'

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'

import { makeDelivery } from '@/domain/admin/_tests/factories/make-delivery'
import { makeCustomer } from '@/domain/admin/_tests/factories/make-customer'

import { makeInMemoryCustomersRepository } from '@/domain/admin/_tests/repositories/factories/make-in-memory-customers-repository'
import { makeInMemoryDeliveriesRepository } from '@/domain/admin/_tests/repositories/factories/make-in-memory-deliveries-repository'

import { InMemoryNotificationsRepository } from '../_test/repositories/in-memory-notifications-repository'
import { InMemoryCustomersRepository } from '@/domain/admin/_tests/repositories/in-memory-customers.repository'
import { InMemoryDeliveriesRepository } from '@/domain/admin/_tests/repositories/in-memory-deliveries.repository'

import { OnDeliveryCreated } from './on-delivery-created'

let customersRepository: InMemoryCustomersRepository
let deliveriesRepository: InMemoryDeliveriesRepository
let notificationsRepository: InMemoryNotificationsRepository

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

let sendNotificationUseCase: SendNotificationUseCase

describe('On Delivery created', () => {
  beforeEach(() => {
    customersRepository = makeInMemoryCustomersRepository()
    deliveriesRepository = makeInMemoryDeliveriesRepository()
    notificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnDeliveryCreated(customersRepository, sendNotificationUseCase)
  })

  it('should send a notification when a delivery is created', async () => {
    const customer = makeCustomer()
    const delivery = makeDelivery({ customerId: customer.id })

    await customersRepository.create(customer)
    deliveriesRepository.create(delivery)

    await vi.waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
