import { makeUser } from '../_tests/factories/make-user'
import { makeCustomer } from '../_tests/factories/make-customer'
import { makeDelivery } from '../_tests/factories/make-delivery'
import { makeDeliveryWorker } from '../_tests/factories/make-delivery-worker'

import { makeInMemoryDeliveriesRepository } from '../_tests/repositories/factories/make-in-memory-deliveries-repository'

import { InMemoryDeliveriesRepository } from '../_tests/repositories/in-memory-deliveries.repository'

import { GetDeliveryDetailsUseCase } from './get-delivery-details.use-case'

let deliveriesRepository: InMemoryDeliveriesRepository

let sut: GetDeliveryDetailsUseCase

describe('Use Case: Get Delivery Details', () => {
  beforeEach(() => {
    deliveriesRepository = makeInMemoryDeliveriesRepository()

    sut = new GetDeliveryDetailsUseCase(deliveriesRepository)
  })

  it('should return a delivery details', async () => {
    const deliveryUser = makeUser()
    deliveriesRepository.deliveryWorkersRepository.usersRepository.items.push(
      deliveryUser,
    )

    const deliveryWorker = makeDeliveryWorker({ userId: deliveryUser.id })
    deliveriesRepository.deliveryWorkersRepository.items.push(deliveryWorker)

    const customerUser = makeUser()
    deliveriesRepository.customersRepository.usersRepository.items.push(
      customerUser,
    )

    const customer = makeCustomer({ userId: customerUser.id })
    deliveriesRepository.customersRepository.items.push(customer)

    const delivery = makeDelivery({
      customerId: customer.id,
      deliveryWorkerId: deliveryWorker.id,
    })
    deliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toEqual({
      deliveryDetails: expect.objectContaining({
        deliveryId: delivery.id,
        customer: expect.objectContaining({ name: customerUser.name }),
        deliveryWorker: expect.objectContaining({ name: deliveryUser.name }),
      }),
    })
  })
})
