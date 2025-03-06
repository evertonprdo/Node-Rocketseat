import { makeCustomer } from '../_tests/factories/make-customer'
import { makeUser } from '../_tests/factories/make-user'
import { makeInMemoryCustomersRepository } from '../_tests/repositories/factories/make-in-memory-customers-repository'

import { InMemoryCustomersRepository } from '../_tests/repositories/in-memory-customers.repository'

import { GetCustomerUseCase } from './get-customer.use-case'

let customersRepository: InMemoryCustomersRepository

let sut: GetCustomerUseCase

describe('Use Cases: Get Customer', () => {
  beforeEach(() => {
    customersRepository = makeInMemoryCustomersRepository()

    sut = new GetCustomerUseCase(customersRepository)
  })

  it('should get a customer', async () => {
    const user = makeUser()
    customersRepository.usersRepository.items.push(user)

    const customer = makeCustomer({ userId: user.id })
    customersRepository.items.push(customer)

    const result = await sut.execute({
      customerId: customer.id.toString(),
    })

    expect(result.isRight()).toEqual(true)

    expect(result.value).toEqual({
      customer: expect.objectContaining({
        userId: customer.userId,
        customerId: customer.id,
      }),
    })
  })
})
