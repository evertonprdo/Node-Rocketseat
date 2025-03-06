import { makeCustomer } from '../_tests/factories/make-customer'
import { makeInMemoryCustomersRepository } from '../_tests/repositories/factories/make-in-memory-customers-repository'

import { InMemoryCustomersRepository } from '../_tests/repositories/in-memory-customers.repository'

import { FetchCustomersUseCase } from './fetch-customers.use-case'

let customersRepository: InMemoryCustomersRepository

let sut: FetchCustomersUseCase

describe('Use Cases: Fetch Customers', () => {
  beforeEach(() => {
    customersRepository = makeInMemoryCustomersRepository()

    sut = new FetchCustomersUseCase(customersRepository)
  })

  it('should fetch customers', async () => {
    customersRepository.items.push(makeCustomer())
    customersRepository.items.push(makeCustomer())
    customersRepository.items.push(makeCustomer())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.customers).toHaveLength(3)
  })

  it('should be able to fetch paginated customers', async () => {
    for (let i = 0; i < 22; i++) {
      customersRepository.items.push(makeCustomer())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.customers).toHaveLength(2)
  })
})
