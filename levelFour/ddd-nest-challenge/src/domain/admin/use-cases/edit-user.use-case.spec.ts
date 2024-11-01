import { FakeHasher } from 'test/cryptography/fake-hasher'

import { makeUser } from '../_tests/factories/make-user'
import { makeInMemoryUsersRepository } from '../_tests/repositories/factories/make-in-memory-users-repository'

import { InMemoryUsersRepository } from '../_tests/repositories/in-memory-users.repository'

import { EditUserUseCase } from './edit-user.use-case'

let usersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher

let sut: EditUserUseCase

describe('Use Cases: Edit User', () => {
  beforeEach(() => {
    usersRepository = makeInMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new EditUserUseCase(usersRepository, fakeHasher)
  })

  it('should edit a user', async () => {
    const user = makeUser({ name: 'John Doe' })
    usersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'Mary',
      password: '123456',
      phone: user.phone,
    })

    expect(result.isRight()).toEqual(true)
    expect(usersRepository.items).toHaveLength(1)

    expect(result.value).toEqual({ user: usersRepository.items[0] })
  })
})
