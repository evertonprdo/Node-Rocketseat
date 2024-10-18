import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries.repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'

import { makeDelivery } from 'test/factories/make-delivery'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { GetDeliveryUseCase } from '../get-delivery.use-case'
import { makeCustomer } from 'test/factories/make-customer'

let customersRepository: InMemoryCustomersRepository
let deliveriesRepository: InMemoryDeliveriesRepository
let sut: GetDeliveryUseCase

describe('Use Cases: Get delivery use case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    deliveriesRepository = new InMemoryDeliveriesRepository(customersRepository)

    sut = new GetDeliveryUseCase(deliveriesRepository)
  })

  it('should get delivery', async () => {
    const customer = makeCustomer()
    customersRepository.items.push(customer)

    const delivery = makeDelivery({ customerId: customer.id })
    deliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toMatchObject({
      delivery: expect.objectContaining({
        customerName: customer.name,
        customerAddress: customer.address,
      }),
    })
  })

  it('should return resource not found', async () => {
    const result = await sut.execute({
      deliveryId: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
