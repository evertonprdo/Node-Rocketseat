import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'
import { makeCustomer } from 'test/factories/make-customer'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { GetCustomerUseCase } from '../get-customer.use-case'

let customersRepository: InMemoryCustomersRepository
let sut: GetCustomerUseCase

describe('Use Cases: Get customer use case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()

    sut = new GetCustomerUseCase(customersRepository)
  })

  it('should get customer', async () => {
    const customer = makeCustomer()
    customersRepository.items.push(customer)

    const result = await sut.execute({
      customerId: customer.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      customer,
    })
  })

  it('should return resource not found', async () => {
    const result = await sut.execute({
      customerId: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
