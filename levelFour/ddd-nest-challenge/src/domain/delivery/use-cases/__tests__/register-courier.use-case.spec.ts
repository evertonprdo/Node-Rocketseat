import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers.repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

import { makeCourier } from 'test/factories/make-courier'

import { CourierAlreadyExistError } from '../errors/courier-already-exists.error'
import { InvalidCPFError } from '../errors/invalid-cpf.error'

import { RegisterCourierUseCase } from '../register-courier.use-case'

let fakeHasher: FakeHasher
let couriersRepository: InMemoryCouriersRepository
let sut: RegisterCourierUseCase

describe('Use Cases: Register Courier', () => {
  beforeEach(() => {
    couriersRepository = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterCourierUseCase(couriersRepository, fakeHasher)
  })

  it('should register a courier', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '011.971.470-12',
      password: '123456',
      operationCity: 'New York',
    })

    expect(result.isRight()).toBe(true)
    expect(couriersRepository.items).toHaveLength(1)
    expect(couriersRepository.items[0].id.toString()).toEqual(
      expect.any(String),
    )
    expect(couriersRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        password: await fakeHasher.hash('123456'),
      }),
    )
  })

  it('should not be possible register with invalid CPF', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: 'invalid-cpf',
      password: '123456',
      operationCity: 'New York',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCPFError)
    expect(couriersRepository.items).toHaveLength(0)
  })

  it('should not be possible register with same CPF twice', async () => {
    const courier = makeCourier()

    await couriersRepository.create(courier)

    const result = await sut.execute({
      name: 'John Doe',
      cpf: courier.cpf.toDecorated(),
      password: '123456',
      operationCity: 'New York',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CourierAlreadyExistError)
    expect(couriersRepository.items).toHaveLength(1)
  })
})
