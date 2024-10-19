import { FakeHasher } from 'test/cryptography/fake-hasher'

import { UserAlreadyExistError } from '../errors/user-already-exists.error'

import { makeUser } from '../../__tests__/factories/makeUser'
import { InMemoryUsersRepository } from '../../__tests__/repositories/in-memory-users.repository'

import { RegisterUserUseCase } from '../register-user.use-case'

let fakeHasher: FakeHasher
let usersRepository: InMemoryUsersRepository

let sut: RegisterUserUseCase

describe('Use Cases: Register user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterUserUseCase(usersRepository, fakeHasher)
  })

  it('should register an user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '011.971.470-12',
      password: '123456',
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
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistError)
    expect(usersRepository.items).toHaveLength(1)
  })
})
