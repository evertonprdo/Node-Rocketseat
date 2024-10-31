import { makeCEP } from 'test/factories/make-cep'
import { makeInMemoryCustomersRepository } from '../_tests/repositories/factories/make-in-memory-customers-repository'
import { makeCustomer } from '../_tests/factories/make-customer'

import { InMemoryCustomersRepository } from '../_tests/repositories/in-memory-customers.repository'

import { EmailAlreadyInUseError } from './errors/email-already-in-use.error'

import { CreateCustomerUseCase } from './create-customer.use-case'

let customersRepository: InMemoryCustomersRepository

let sut: CreateCustomerUseCase

describe('Use Cases: Create customer', () => {
  beforeEach(() => {
    customersRepository = makeInMemoryCustomersRepository()

    sut = new CreateCustomerUseCase(customersRepository)
  })

  it('should create a customer', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'test@example.com',
      city: 'city',
      cep: makeCEP(),
      state: 'state',
      street: 'street',
      number: '537',
      neighborhood: 'test',
    })

    expect(result.isRight()).toEqual(true)

    expect(customersRepository.items).toHaveLength(1)
    expect(result.value).toEqual({
      customer: customersRepository.items[0],
    })
  })

  it('should not be able register with same email twice', async () => {
    customersRepository.items.push(makeCustomer({ email: 'same@email.com' }))

    const result = await sut.execute({
      name: 'John Doe',
      email: 'same@email.com',
      city: 'city',
      cep: makeCEP(),
      state: 'state',
      street: 'street',
      number: '537',
      neighborhood: 'test',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyInUseError)
  })
})
