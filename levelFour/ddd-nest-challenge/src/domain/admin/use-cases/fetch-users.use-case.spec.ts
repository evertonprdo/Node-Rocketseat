import { makeUser } from '../_tests/factories/make-user'
import { makeInMemoryUsersRepository } from '../_tests/repositories/factories/make-in-memory-users-repository'

import { InMemoryUsersRepository } from '../_tests/repositories/in-memory-users.repository'

import { FetchUsersUseCase } from './fetch-users.use-case'

let usersRepository: InMemoryUsersRepository

let sut: FetchUsersUseCase

describe('Use Cases: Fetch Users', () => {
  beforeEach(() => {
    usersRepository = makeInMemoryUsersRepository()

    sut = new FetchUsersUseCase(usersRepository)
  })

  it('should fetch a user', async () => {
    usersRepository.items.push(makeUser())
    usersRepository.items.push(makeUser())
    usersRepository.items.push(makeUser())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.users).toHaveLength(3)
  })

  it('should be able to fetch paginated users', async () => {
    for (let i = 0; i < 22; i++) {
      usersRepository.items.push(makeUser())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.users).toHaveLength(2)
  })
})
