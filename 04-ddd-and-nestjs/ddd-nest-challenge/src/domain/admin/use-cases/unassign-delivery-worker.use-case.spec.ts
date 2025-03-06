import { makeDeliveryWorker } from '../_tests/factories/make-delivery-worker'
import { makeInMemoryDeliveryWorkersRepository } from '../_tests/repositories/factories/make-in-memory-delivery-workers-repository'

import { InMemoryDeliveryWorkersRepository } from '../_tests/repositories/in-memory-delivery-workers.repository'

import { UnassignDeliveryWorkerUseCase } from './unassign-delivery-worker.use-case'

let deliveryWorkersRepository: InMemoryDeliveryWorkersRepository

let sut: UnassignDeliveryWorkerUseCase

describe('Use Cases: Unassign Delivery Worker', () => {
  beforeEach(() => {
    deliveryWorkersRepository = makeInMemoryDeliveryWorkersRepository()

    sut = new UnassignDeliveryWorkerUseCase(deliveryWorkersRepository)
  })

  it('should be able to unassign a delivery worker', async () => {
    const deliveryWorker = makeDeliveryWorker()
    deliveryWorkersRepository.items.push(deliveryWorker)

    const result = await sut.execute({
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(deliveryWorkersRepository.items).toHaveLength(0)
  })
})
