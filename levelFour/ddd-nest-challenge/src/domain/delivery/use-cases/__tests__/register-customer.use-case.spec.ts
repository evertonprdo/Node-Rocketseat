import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'
import { makeCustomer } from 'test/factories/make-customer'

import { CustomerAlreadyExistError } from '../errors/customer-already-exists.error'

import { RegisterCustomerUseCase } from '../register-customer.use-case'

let customersRepository: InMemoryCustomersRepository
let sut: RegisterCustomerUseCase

describe('Use Cases: Register customer', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()

    sut = new RegisterCustomerUseCase(customersRepository)
  })

  it('should register a customer', async () => {
    const customer = makeCustomer()

    const result = await sut.execute({
      name: customer.name,
      email: customer.email,
      address: {
        ...customer.address,
        cep: customer.address.cep.toDecorated(),
      },
    })

    expect(result.isRight()).toBe(true)
    expect(customersRepository.items).toHaveLength(1)

    expect(customersRepository.items[0].id.toString()).toEqual(
      expect.any(String),
    )

    expect(customersRepository.items[0]).toEqual(
      expect.objectContaining({
        name: customer.name,
        email: customer.email,
        address: customer.address,
      }),
    )
  })

  it('should not register customer with same email twice', async () => {
    const customer = makeCustomer()

    await customersRepository.create(customer)

    const result = await sut.execute({
      name: customer.name,
      email: customer.email,
      address: {
        ...customer.address,
        cep: customer.address.cep.toDecorated(),
      },
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CustomerAlreadyExistError)
    expect(customersRepository.items).toHaveLength(1)
  })
})
