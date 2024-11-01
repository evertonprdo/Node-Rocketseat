import { makeCustomer } from '../_tests/factories/make-customer'
import { makeInMemoryCustomersRepository } from '../_tests/repositories/factories/make-in-memory-customers-repository'

import { InMemoryCustomersRepository } from '../_tests/repositories/in-memory-customers.repository'

import { DeleteCustomerUseCase } from './delete-customer.use-case'

let customersRepository: InMemoryCustomersRepository

let sut: DeleteCustomerUseCase

describe('Use Cases: Delete Customer', () => {
  beforeEach(() => {
    customersRepository = makeInMemoryCustomersRepository()

    sut = new DeleteCustomerUseCase(customersRepository)
  })

  it('should delete a customer', async () => {
    const customer = makeCustomer()
    customersRepository.items.push(customer)

    const result = await sut.execute({
      customerId: customer.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(customersRepository.items).toHaveLength(0)
  })
})
