import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins.repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAdmin } from 'test/factories/make-admin'

import { AdminAlreadyExistError } from '../errors/admin-already-exists.error'

import { RegisterAdminUseCase } from '../register-admin.use-case'

let fakeHasher: FakeHasher
let adminsRepository: InMemoryAdminsRepository
let sut: RegisterAdminUseCase

describe('Use Cases: Register admin', () => {
  beforeEach(() => {
    adminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterAdminUseCase(adminsRepository, fakeHasher)
  })

  it('should register an admin', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '011.971.470-12',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(adminsRepository.items).toHaveLength(1)

    expect(adminsRepository.items[0].id.toString()).toEqual(expect.any(String))
    expect(adminsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        password: await fakeHasher.hash('123456'),
      }),
    )
  })

  it('should not register admin with same CPF twice', async () => {
    const admin = makeAdmin()

    await adminsRepository.create(admin)

    const result = await sut.execute({
      name: 'John Doe',
      cpf: admin.cpf.toDecorated(),
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AdminAlreadyExistError)
    expect(adminsRepository.items).toHaveLength(1)
  })
})
