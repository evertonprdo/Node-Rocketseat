import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'
import { makeCustomer } from 'test/factories/make-customer'

import { ListCustomersUseCase } from '../list-customer.use-case'

let customersRepository: InMemoryCustomersRepository
let sut: ListCustomersUseCase

describe('Use Cases: List customers', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    sut = new ListCustomersUseCase(customersRepository)
  })

  it('should list customers', async () => {
    const customers = Array.from({ length: 5 }, () => makeCustomer())

    customersRepository.items.push(...customers)

    const result = await sut.execute({ page: 1 })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.customer).toHaveLength(5)
    expect(result.value?.customer).toEqual(expect.arrayContaining(customers))
  })

  it('should list customers paginated', async () => {
    const customers = Array.from({ length: 27 }, () => makeCustomer())
    customersRepository.items.push(...customers)

    const result = await sut.execute({ page: 2 })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.customer).toHaveLength(7)
  })
})
