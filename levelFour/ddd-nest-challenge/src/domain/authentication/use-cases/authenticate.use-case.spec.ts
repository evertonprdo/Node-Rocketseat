import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { makeUser } from '../_tests/factories/make-user'
import { InMemoryUsersRepository } from '../_tests/repositories/in-memory-users.repository'

import { FakeHasher } from '@/domain/_shared/_tests/cryptography/fake-hasher'
import { FakeEncrypter } from '../_tests/cryptography/fake-encrypter'

import { AuthenticateUseCase } from './authenticate.use-case'

let fakeEncrypter: FakeEncrypter
let fakeHasher: FakeHasher
let usersRepository: InMemoryUsersRepository

let sut: AuthenticateUseCase

describe('Use Case: Authenticate', () => {
  beforeEach(() => {
    fakeEncrypter = new FakeEncrypter()
    fakeHasher = new FakeHasher()
    usersRepository = new InMemoryUsersRepository()

    sut = new AuthenticateUseCase(usersRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to authenticate an user', async () => {
    const user = makeUser({ password: await fakeHasher.hash('password') })
    usersRepository.items.push(user)

    const result = await sut.execute({
      cpf: user.cpf.toDecorated(),
      password: 'password',
    })

    expect(result.isRight()).toEqual(true)

    if (result.isLeft()) {
      throw new Error()
    }

    expect(JSON.parse(result.value.accessToken)).toEqual({
      sub: user.id.toString(),
      roles: ['USER'],
    })
  })

  it('should be able to authenticate an admin', async () => {
    const user = makeUser({
      password: await fakeHasher.hash('password'),
      adminId: new UniqueEntityId(),
    })
    usersRepository.items.push(user)

    const result = await sut.execute({
      cpf: user.cpf.toDecorated(),
      password: 'password',
    })

    expect(result.isRight()).toEqual(true)

    if (result.isLeft()) {
      throw new Error()
    }

    expect(JSON.parse(result.value.accessToken)).toEqual({
      sub: user.id.toString(),
      roles: ['USER', 'ADMIN'],
    })
  })

  it('should be able to authenticate a delivery worker', async () => {
    const user = makeUser({
      password: await fakeHasher.hash('password'),
      deliveryWorkerId: new UniqueEntityId(),
    })
    usersRepository.items.push(user)

    const result = await sut.execute({
      cpf: user.cpf.toDecorated(),
      password: 'password',
    })

    expect(result.isRight()).toEqual(true)

    if (result.isLeft()) {
      throw new Error()
    }

    expect(JSON.parse(result.value.accessToken)).toEqual({
      sub: user.id.toString(),
      roles: ['USER', 'DELIVERY_WORKER'],
    })
  })
})
