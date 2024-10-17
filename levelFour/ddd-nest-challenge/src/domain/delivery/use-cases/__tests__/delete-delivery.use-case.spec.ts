import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries.repository'
import { makeDelivery } from 'test/factories/make-delivery'

import { DeleteDeliveryUseCase } from '../delete-delivery.use-case'

let deliveriesRepository: InMemoryDeliveriesRepository
let sut: DeleteDeliveryUseCase

describe('Use Cases: Delete Delivery', () => {
  beforeEach(() => {
    deliveriesRepository = new InMemoryDeliveriesRepository()

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
