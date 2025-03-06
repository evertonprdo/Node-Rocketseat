import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { makeDelivery } from '../_tests/factories/make-delivery'
import { makeDeliveryWorker } from '../_tests/factories/make-delivery-worker'
import { makeInMemoryDeliveriesRepository } from '../_tests/repositories/factories/make-in-memory-deliveries.repository'
import { makeInMemoryDeliveryWorkersRepository } from '../_tests/repositories/factories/make-in-memory-delivery-workers.repository'

import { InMemoryDeliveriesRepository } from '../_tests/repositories/in-memory-deliveries.repository'
import { InMemoryDeliveryWorkersRepository } from '../_tests/repositories/in-memory-delivery-workers.repository'

import { DeliveryAlreadyPickedUpError } from './errors/delivery-already-picked-up.error'

import { MarkDeliveryAsPickedUp } from './mark-delivery-as-picked-up.use-case'

let deliveryWorkersRepository: InMemoryDeliveryWorkersRepository
let deliveriesRepository: InMemoryDeliveriesRepository

let sut: MarkDeliveryAsPickedUp

describe('Use Case: Mark Delivery as picked up', () => {
  beforeEach(() => {
    deliveriesRepository = makeInMemoryDeliveriesRepository()
    deliveryWorkersRepository = makeInMemoryDeliveryWorkersRepository()

    sut = new MarkDeliveryAsPickedUp(
      deliveriesRepository,
      deliveryWorkersRepository,
    )
  })

  it('should mark a delivery as picked up', async () => {
    const delivery = makeDelivery()
    deliveriesRepository.items.push(delivery)

    const deliveryWorker = makeDeliveryWorker()
    deliveryWorkersRepository.items.push(deliveryWorker)

    const result = await sut.execute({
      deliveryId: delivery.id.toString(),
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toEqual({
      delivery: expect.objectContaining({
        status: 'PICKED_UP',
        deliveryWorkerId: deliveryWorker.id,
      }),
    })
  })

  it('should not be possible to withdraw a delivery that has already been withdrawn', async () => {
    const delivery = makeDelivery({
      status: 'PICKED_UP',
      deliveryWorkerId: new UniqueEntityId(),
    })
    deliveriesRepository.items.push(delivery)

    const deliveryWorker = makeDeliveryWorker()
    deliveryWorkersRepository.items.push(deliveryWorker)

    const result = await sut.execute({
      deliveryId: delivery.id.toString(),
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(DeliveryAlreadyPickedUpError)
  })
})
