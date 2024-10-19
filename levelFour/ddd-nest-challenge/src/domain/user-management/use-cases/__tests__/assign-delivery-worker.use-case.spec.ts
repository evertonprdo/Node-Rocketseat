import { InMemoryUsersRepository } from '../../__tests__/repositories/in-memory-users.repository'

import { AssignDeliveryWorkerUseCase } from '../assign-delivery-worker.use-case'
import { InMemoryDeliveryWorkersRepository } from '../../__tests__/repositories/in-memory-delivery-workers.repository'
import { makeUser } from '../../__tests__/factories/makeUser'

let usersRepository: InMemoryUsersRepository
let deliveryWorkersRepository: InMemoryDeliveryWorkersRepository

let sut: AssignDeliveryWorkerUseCase

describe('Use Cases: Register user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    deliveryWorkersRepository = new InMemoryDeliveryWorkersRepository()

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

    console.log(result.value)

    expect(result.isRight()).toEqual(true)
  })
})
