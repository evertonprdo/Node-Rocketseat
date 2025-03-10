import { FakeHasher } from '@/domain/_shared/_tests/cryptography/fake-hasher'

import { InMemoryUsersRepository } from '../_tests/repositories/in-memory-users.repository'

import { makeUser } from '../_tests/factories/make-user'
import { makeInMemoryUsersRepository } from '../_tests/repositories/factories/make-in-memory-users-repository'

import { UserAlreadyExistError } from './errors/user-already-exists.error'

import { RegisterUseCase } from './register.use-case'

let fakeHasher: FakeHasher
let usersRepository: InMemoryUsersRepository

let sut: RegisterUseCase

describe('Use Cases: Register user', () => {
  beforeEach(() => {
    usersRepository = makeInMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterUseCase(usersRepository, fakeHasher)
  })

  it('should register an user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '011.971.470-12',
      password: '123456',
      phone: '(84) 99677-0368',
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items).toHaveLength(1)

    expect(usersRepository.items[0].id.toString()).toEqual(expect.any(String))
    expect(usersRepository.items[0]).toMatchObject({
      name: 'John Doe',
      password: await fakeHasher.hash('123456'),
    })
  })

  it('should not register user with same CPF twice', async () => {
    const user = makeUser()

    await usersRepository.create(user)

    const result = await sut.execute({
      name: 'John Doe',
      cpf: user.cpf.toDecorated(),
      password: '123456',
      phone: '(84) 99677-0368',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistError)
    expect(usersRepository.items).toHaveLength(1)
  })
})
