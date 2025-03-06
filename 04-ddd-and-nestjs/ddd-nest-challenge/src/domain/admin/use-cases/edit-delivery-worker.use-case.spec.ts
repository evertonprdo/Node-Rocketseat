import { makeDeliveryWorker } from '../_tests/factories/make-delivery-worker'
import { makeInMemoryDeliveryWorkersRepository } from '../_tests/repositories/factories/make-in-memory-delivery-workers-repository'

import { InMemoryDeliveryWorkersRepository } from '../_tests/repositories/in-memory-delivery-workers.repository'

import { EditDeliveryWorkerUseCase } from './edit-delivery-worker.use-case'

let deliveryWorkersRepository: InMemoryDeliveryWorkersRepository

let sut: EditDeliveryWorkerUseCase

describe('Use Cases: Edit Delivery Worker', () => {
  beforeEach(() => {
    deliveryWorkersRepository = makeInMemoryDeliveryWorkersRepository()

    sut = new EditDeliveryWorkerUseCase(deliveryWorkersRepository)
  })

  it('should edit a delivery worker', async () => {
    const deliveryWorker = makeDeliveryWorker({ operationZone: 'old-city' })
    deliveryWorkersRepository.items.push(deliveryWorker)

    const result = await sut.execute({
      deliveryWorkerId: deliveryWorker.id.toString(),
      operationZone: 'new-city',
    })

    expect(result.isRight()).toEqual(true)
    expect(deliveryWorkersRepository.items).toHaveLength(1)

    expect(result.value).toEqual({
      deliveryWorker: deliveryWorkersRepository.items[0],
    })
  })
})
