import { makeUser } from '../_tests/factories/make-user'
import { makeDeliveryWorker } from '../_tests/factories/make-delivery-worker'

import { makeInMemoryDeliveryWorkersRepository } from '../_tests/repositories/factories/make-in-memory-delivery-workers-repository'

import { InMemoryDeliveryWorkersRepository } from '../_tests/repositories/in-memory-delivery-workers.repository'

import { GetDeliveryWorkerUseCase } from './get-delivery-worker.use-case'

let deliveryWorkersRepository: InMemoryDeliveryWorkersRepository

let sut: GetDeliveryWorkerUseCase

describe('Use Cases: Get Delivery Worker', () => {
  beforeEach(() => {
    deliveryWorkersRepository = makeInMemoryDeliveryWorkersRepository()

    sut = new GetDeliveryWorkerUseCase(deliveryWorkersRepository)
  })

  it('should get a delivery worker', async () => {
    const user = makeUser()
    deliveryWorkersRepository.usersRepository.items.push(user)

    const deliveryWorker = makeDeliveryWorker({ userId: user.id })
    deliveryWorkersRepository.items.push(deliveryWorker)

    const result = await sut.execute({
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toEqual({
      deliveryWorker: expect.objectContaining({
        userId: user.id,
        deliveryWorkerId: deliveryWorker.id,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        operationZone: deliveryWorker.operationZone,
      }),
    })
  })
})
