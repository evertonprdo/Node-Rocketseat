import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'
import { makeCustomer } from 'test/factories/make-customer'

import { DeleteCustomerUseCase } from '../delete-customer.use-case'

let customersRepository: InMemoryCustomersRepository
let sut: DeleteCustomerUseCase

describe('Use Cases: Delete Customer', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()

    sut = new DeleteCustomerUseCase(customersRepository)
  })

  it('should delete a customer', async () => {
    const customer = makeCustomer()
    customersRepository.items.push(customer)

    const result = await sut.execute({ customerId: customer.id.toString() })

    expect(result.isRight()).toEqual(true)
    expect(customersRepository.items).toHaveLength(0)
  })
})
