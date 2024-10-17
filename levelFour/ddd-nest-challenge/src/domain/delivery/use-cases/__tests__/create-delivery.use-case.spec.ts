import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries.repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'

import { makeCustomer } from 'test/factories/make-customer'

import { CreateDeliveryUseCase } from '../create-delivery.use-case'

let customersRepository: InMemoryCustomersRepository
let deliveriesRepository: InMemoryDeliveriesRepository

let sut: CreateDeliveryUseCase

describe('Use Cases: Create Delivery', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    deliveriesRepository = new InMemoryDeliveriesRepository()

    sut = new CreateDeliveryUseCase(deliveriesRepository, customersRepository)
  })

  it('should create a new delivery', async () => {
    const customer = makeCustomer()
    customersRepository.items.push(customer)

    const result = await sut.execute({
      customerId: customer.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(deliveriesRepository.items).toHaveLength(1)

    expect(deliveriesRepository.items[0].id).toMatchObject({
      value: expect.any(String),
    })

    expect(deliveriesRepository.items[0].status).toBe('PENDING')
    expect(deliveriesRepository.items[0].createdAt).toEqual(expect.any(Date))
    expect(deliveriesRepository.items[0].customerId).toBe(customer.id)
  })
})
