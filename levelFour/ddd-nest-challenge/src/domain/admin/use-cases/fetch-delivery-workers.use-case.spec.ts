import { makeUser } from '../_tests/factories/make-user'
import { makeDeliveryWorker } from '../_tests/factories/make-delivery-worker'
import { makeInMemoryDeliveryWorkersRepository } from '../_tests/repositories/factories/make-in-memory-delivery-workers-repository'

import { InMemoryDeliveryWorkersRepository } from '../_tests/repositories/in-memory-delivery-workers.repository'

import { FetchDeliveryWorkersUseCase } from './fetch-delivery-workers.use-case'

let deliveryWorkersRepository: InMemoryDeliveryWorkersRepository
let sut: FetchDeliveryWorkersUseCase

describe('Use Case: Fetch Delivery Workers', () => {
  beforeEach(() => {
    deliveryWorkersRepository = makeInMemoryDeliveryWorkersRepository()

    sut = new FetchDeliveryWorkersUseCase(deliveryWorkersRepository)
  })

  it('should fetch delivery workers', async () => {
    const user1 = makeUser()
    const user2 = makeUser()
    const user3 = makeUser()

    const deliveryWorker1 = makeDeliveryWorker({ userId: user1.id })
    const deliveryWorker2 = makeDeliveryWorker({ userId: user2.id })
    const deliveryWorker3 = makeDeliveryWorker({ userId: user3.id })

    deliveryWorkersRepository.usersRepository.items.push(user1)
    deliveryWorkersRepository.usersRepository.items.push(user2)
    deliveryWorkersRepository.usersRepository.items.push(user3)

    deliveryWorkersRepository.items.push(deliveryWorker1)
    deliveryWorkersRepository.items.push(deliveryWorker2)
    deliveryWorkersRepository.items.push(deliveryWorker3)

    const result = await sut.execute({ page: 1 })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.deliveryWorkers).toHaveLength(3)

    expect(result.value?.deliveryWorkers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: user1.id,
          deliveryWorkerId: deliveryWorker1.id,
        }),
        expect.objectContaining({
          userId: user2.id,
          deliveryWorkerId: deliveryWorker2.id,
        }),
        expect.objectContaining({
          userId: user3.id,
          deliveryWorkerId: deliveryWorker3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated delivery workers', async () => {
    for (let i = 0; i < 22; i++) {
      const user = makeUser()
      const deliveryWorker = makeDeliveryWorker({ userId: user.id })

      deliveryWorkersRepository.usersRepository.items.push(user)
      deliveryWorkersRepository.items.push(deliveryWorker)
    }

    const result = await sut.execute({ page: 2 })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.deliveryWorkers).toHaveLength(2)
  })
})
