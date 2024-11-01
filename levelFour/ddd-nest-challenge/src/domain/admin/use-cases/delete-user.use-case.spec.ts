import { makeUser } from '../_tests/factories/make-user'
import { makeInMemoryUsersRepository } from '../_tests/repositories/factories/make-in-memory-users-repository'

import { InMemoryUsersRepository } from '../_tests/repositories/in-memory-users.repository'

import { DeleteUserUseCase } from './delete-user.use-case'

let usersRepository: InMemoryUsersRepository

let sut: DeleteUserUseCase

describe('Use Cases: Delete User', () => {
  beforeEach(() => {
    usersRepository = makeInMemoryUsersRepository()

    sut = new DeleteUserUseCase(usersRepository)
  })

  it('should delete a user', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(usersRepository.items).toHaveLength(0)
  })
})
