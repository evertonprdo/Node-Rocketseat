import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { makeDelivery } from '../_tests/factories/make-delivery'
import { makeInMemoryDeliveriesRepository } from '../_tests/repositories/factories/make-in-memory-deliveries.repository'

import { InMemoryDeliveriesRepository } from '../_tests/repositories/in-memory-deliveries.repository'

import { DeliveryBeingMadeByWrongDeliveryWorkerError } from './errors/delivery-being-made-by-the-wrong-delivery-worker'

import { MarkDeliveryAsDelivered } from './mark-delivery-as-delivered.use-case'

let deliveriesRepository: InMemoryDeliveriesRepository

let sut: MarkDeliveryAsDelivered

describe('Use Case: Mark Delivery as Delivered', () => {
  beforeEach(() => {
    deliveriesRepository = makeInMemoryDeliveriesRepository()

    sut = new MarkDeliveryAsDelivered(deliveriesRepository)
  })

  it('should be able to mark a delivery as delivered', async () => {
    const delivery = makeDelivery({
      status: 'PICKED_UP',
      pickedUpDate: new Date(),
      deliveryWorkerId: new UniqueEntityId('correct-delivery-worker'),
    })
    deliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toString(),
      deliveryWorkerId: 'correct-delivery-worker',
      attachmentId: '1',
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toEqual({
      delivery: expect.objectContaining({
        status: 'DELIVERED',
        attachment: expect.objectContaining({
          deliveryId: delivery.id,
          attachmentId: new UniqueEntityId('1'),
        }),
      }),
    })
  })

  it('should not be marked as delivered by another delivery worker', async () => {
    const delivery = makeDelivery({
      status: 'PICKED_UP',
      pickedUpDate: new Date(),
      deliveryWorkerId: new UniqueEntityId('correct-delivery-worker'),
    })
    deliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toString(),
      deliveryWorkerId: 'wrong-delivery-worker',
      attachmentId: '1',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(
      DeliveryBeingMadeByWrongDeliveryWorkerError,
    )
  })
})
