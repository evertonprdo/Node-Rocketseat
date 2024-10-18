import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries.repository'
import { makeDelivery } from 'test/factories/make-delivery'

import { DeleteDeliveryUseCase } from '../delete-delivery.use-case'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'

let customersRepository: InMemoryCustomersRepository
let deliveriesRepository: InMemoryDeliveriesRepository
let sut: DeleteDeliveryUseCase

describe('Use Cases: Delete Delivery', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    deliveriesRepository = new InMemoryDeliveriesRepository(customersRepository)

    sut = new DeleteDeliveryUseCase(deliveriesRepository)
  })

  it('should delete a delivery', async () => {
    const delivery = makeDelivery()
    deliveriesRepository.items.push(delivery)

    const result = await sut.execute({ deliveryId: delivery.id.toString() })

    expect(result.isRight()).toEqual(true)
    expect(deliveriesRepository.items).toHaveLength(0)
  })
})
