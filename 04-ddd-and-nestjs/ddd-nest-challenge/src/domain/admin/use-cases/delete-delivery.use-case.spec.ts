import { makeDelivery } from '../_tests/factories/make-delivery'
import { makeInMemoryDeliveriesRepository } from '../_tests/repositories/factories/make-in-memory-deliveries-repository'

import { InMemoryDeliveriesRepository } from '../_tests/repositories/in-memory-deliveries.repository'

import { DeleteDeliveryUseCase } from './delete-delivery.use-case'

let deliveriesRepository: InMemoryDeliveriesRepository

let sut: DeleteDeliveryUseCase

describe('Use Cases: Delete Delivery', () => {
  beforeEach(() => {
    deliveriesRepository = makeInMemoryDeliveriesRepository()

    sut = new DeleteDeliveryUseCase(deliveriesRepository)
  })

  it('should delete a delivery', async () => {
    const delivery = makeDelivery()
    deliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(deliveriesRepository.items).toHaveLength(0)
  })
})
