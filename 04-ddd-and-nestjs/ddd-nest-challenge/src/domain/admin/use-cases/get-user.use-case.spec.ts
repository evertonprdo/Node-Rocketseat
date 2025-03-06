import { makeUser } from '../_tests/factories/make-user'
import { makeInMemoryUsersRepository } from '../_tests/repositories/factories/make-in-memory-users-repository'

import { InMemoryUsersRepository } from '../_tests/repositories/in-memory-users.repository'

import { GetUserUseCase } from './get-user.use-case'

let usersRepository: InMemoryUsersRepository

let sut: GetUserUseCase

describe('Use Cases: Get User', () => {
  beforeEach(() => {
    usersRepository = makeInMemoryUsersRepository()

    sut = new GetUserUseCase(usersRepository)
  })

  it('should get a user', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toEqual({ user: usersRepository.items[0] })
  })
})
