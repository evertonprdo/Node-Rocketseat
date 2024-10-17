import { makeDelivery } from 'test/factories/make-delivery'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { GetDeliveryUseCase } from '../get-delivery.use-case'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries.repository'

let deliveriesRepository: InMemoryDeliveriesRepository
let sut: GetDeliveryUseCase

describe('Use Cases: Get delivery use case', () => {
  beforeEach(() => {
    deliveriesRepository = new InMemoryDeliveriesRepository()

    sut = new GetDeliveryUseCase(deliveriesRepository)
  })

  it('should get delivery', async () => {
    const delivery = makeDelivery()
    deliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      delivery,
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
