import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins.repository'

import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeAdmin } from 'test/factories/make-admin'

import { CPF } from '../../entities/value-objects/cpf'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'

import { AuthenticateAdminUseCase } from '../authenticate.use-case'

let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let adminsRepository: InMemoryAdminsRepository

let sut: AuthenticateAdminUseCase

describe('Use Cases: Authenticate admin', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    adminsRepository = new InMemoryAdminsRepository()

    sut = new AuthenticateAdminUseCase(
      adminsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate an admin', async () => {
    const admin = makeAdmin({ password: await fakeHasher.hash('123456') })

    adminsRepository.items.push(admin)

    const result = await sut.execute({
      cpf: admin.cpf.toDecorated(),
      password: '123456',
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong credentials', async () => {
    adminsRepository.items.push(
      makeAdmin({
        cpf: CPF.createFromText('974.432.170-99'),
        password: await fakeHasher.hash('correct-password'),
      }),
    )

    const validWrongCpfResult = await sut.execute({
      cpf: '715.972.220-54',
      password: 'correct-password',
    })

    const wrongPasswordResult = await sut.execute({
      cpf: '974.432.170-99',
      password: 'wrong-password',
    })

    expect(validWrongCpfResult.isLeft()).toEqual(true)
    expect(validWrongCpfResult.value).toBeInstanceOf(WrongCredentialsError)

    expect(wrongPasswordResult.isLeft()).toEqual(true)
    expect(wrongPasswordResult.value).toBeInstanceOf(WrongCredentialsError)
  })
})
