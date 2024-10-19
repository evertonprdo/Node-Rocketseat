import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'
import { makeCustomer } from 'test/factories/make-customer'

import { EditCustomerUseCase } from '../edit-customer.use-case'

let customersRepository: InMemoryCustomersRepository
let sut: EditCustomerUseCase

describe('Use Cases: Edit customer', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()

    sut = new EditCustomerUseCase(customersRepository)
  })

  it('should edit a customer', async () => {
    const customer = makeCustomer()
    customersRepository.items.push(customer)

    const result = await sut.execute({
      customerId: customer.id.toString(),
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
})
