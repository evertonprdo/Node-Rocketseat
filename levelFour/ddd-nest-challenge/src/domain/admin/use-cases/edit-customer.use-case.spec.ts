import { makeAddress } from '@/domain/_shared/_tests/factories/make-address'
import { makeCustomer } from '../_tests/factories/make-customer'
import { makeInMemoryCustomersRepository } from '../_tests/repositories/factories/make-in-memory-customers-repository'

import { InMemoryCustomersRepository } from '../_tests/repositories/in-memory-customers.repository'

import { EditCustomerUseCase } from './edit-customer.use-case'

let customersRepository: InMemoryCustomersRepository

let sut: EditCustomerUseCase

describe('Use Cases: Edit Customer', () => {
  beforeEach(() => {
    customersRepository = makeInMemoryCustomersRepository()

    sut = new EditCustomerUseCase(customersRepository)
  })

  it('should edit a customer', async () => {
    const address = makeAddress({ city: 'old-city' })
    const customer = makeCustomer({ name: 'John Doe', address })
    customersRepository.items.push(customer)

    const result = await sut.execute({
      customerId: customer.id.toString(),
      cep: customer.address.cep.toDecorated(),
      name: 'Mary',
      city: 'new-city',
      state: customer.address.state,
      neighborhood: customer.address.neighborhood,
      street: customer.address.street,
      number: customer.address.number,
    })

    expect(result.isRight()).toEqual(true)
    expect(customersRepository.items).toHaveLength(1)

    expect(result.value).toEqual({ customer: customersRepository.items[0] })
  })
})
