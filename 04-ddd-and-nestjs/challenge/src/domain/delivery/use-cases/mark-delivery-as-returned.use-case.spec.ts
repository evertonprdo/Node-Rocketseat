import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { makeDelivery } from '../_tests/factories/make-delivery'
import { makeInMemoryDeliveriesRepository } from '../_tests/repositories/factories/make-in-memory-deliveries.repository'

import { InMemoryDeliveriesRepository } from '../_tests/repositories/in-memory-deliveries.repository'

import { DeliveryBeingMadeByWrongDeliveryWorkerError } from './errors/delivery-being-made-by-the-wrong-delivery-worker'

import { MarkDeliveryAsReturned } from './mark-delivery-as-returned.use-case'

let deliveriesRepository: InMemoryDeliveriesRepository

let sut: MarkDeliveryAsReturned

describe('Use Case: Mark Delivery as Returned', () => {
  beforeEach(() => {
    deliveriesRepository = makeInMemoryDeliveriesRepository()

    sut = new MarkDeliveryAsReturned(deliveriesRepository)
  })

  it('should be able to mark a delivery as returned', async () => {
    const delivery = makeDelivery({
      status: 'PICKED_UP',
      pickedUpAt: new Date(),
      deliveryWorkerId: new UniqueEntityId('delivery-worker'),
    })
    deliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toString(),
      deliveryWorkerId: 'delivery-worker',
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toEqual({
      delivery: expect.objectContaining({
        status: 'RETURNED',
      }),
    })
  })

  it('should not be able to mark a delivery as returned by another delivery worker', async () => {
    const delivery = makeDelivery({
      status: 'PICKED_UP',
      pickedUpAt: new Date(),
      deliveryWorkerId: new UniqueEntityId('delivery-worker'),
    })
    deliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toString(),
      deliveryWorkerId: 'wrong-delivery-worker',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(
      DeliveryBeingMadeByWrongDeliveryWorkerError,
    )
  })
})
