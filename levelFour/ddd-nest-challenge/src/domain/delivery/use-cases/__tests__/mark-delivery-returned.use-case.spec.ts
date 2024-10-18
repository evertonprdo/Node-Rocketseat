import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries.repository'

import { makeDelivery } from 'test/factories/make-delivery'

import { MarkDeliveryReturnedUseCase } from '../mark-delivery-returned.use-case'

let customersRepository: InMemoryCustomersRepository
let deliveriesRepository: InMemoryDeliveriesRepository

let sut: MarkDeliveryReturnedUseCase

describe('Use Cases: Mark Delivery Returned', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    deliveriesRepository = new InMemoryDeliveriesRepository(customersRepository)

    sut = new MarkDeliveryReturnedUseCase(deliveriesRepository)
  })

  it('should mark a delivery as returned', async () => {
    const delivery = makeDelivery({ status: 'PENDING' })
    deliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(deliveriesRepository.items[0]).toMatchObject({
      status: 'RETURNED',
    })
  })
})
