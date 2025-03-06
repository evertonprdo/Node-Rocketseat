import { InMemoryUsersRepository } from '../_tests/repositories/in-memory-users.repository'
import { InMemoryDeliveryWorkersRepository } from '../_tests/repositories/in-memory-delivery-workers.repository'

import { makeUser } from '../_tests/factories/make-user'
import { makeDeliveryWorker } from '../_tests/factories/make-delivery-worker'
import { makeInMemoryUsersRepository } from '../_tests/repositories/factories/make-in-memory-users-repository'
import { makeInMemoryDeliveryWorkersRepository } from '../_tests/repositories/factories/make-in-memory-delivery-workers-repository'

import { UserAlreadyAssignedError } from './errors/user-already-assigned.error'

import { AssignDeliveryWorkerUseCase } from './assign-delivery-worker.use-case'

let usersRepository: InMemoryUsersRepository
let deliveryWorkersRepository: InMemoryDeliveryWorkersRepository

let sut: AssignDeliveryWorkerUseCase

describe('Use Cases: Assign Delivery Worker', () => {
  beforeEach(() => {
    usersRepository = makeInMemoryUsersRepository()
    deliveryWorkersRepository = makeInMemoryDeliveryWorkersRepository()

    sut = new AssignDeliveryWorkerUseCase(
      usersRepository,
      deliveryWorkersRepository,
    )
  })

  it('should assign an user as delivery worker', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      operationZone: 'New York',
    })

    expect(result.isRight()).toEqual(true)

    expect(deliveryWorkersRepository.items).toHaveLength(1)
    expect(deliveryWorkersRepository.items[0].userId).toEqual(user.id)
    expect(deliveryWorkersRepository.items[0].operationZone).toEqual('New York')
  })

  it('should not be able to assign an user as delivery worker twice', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    deliveryWorkersRepository.items.push(
      makeDeliveryWorker({ userId: user.id }),
    )

    const result = await sut.execute({
      userId: user.id.toString(),
      operationZone: 'New York',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UserAlreadyAssignedError)
  })
})
