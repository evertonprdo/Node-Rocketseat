import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries.repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers.repository'

import { makeCEP } from 'test/factories/make-cep'
import { makeCourier } from 'test/factories/make-courier'
import { makeDelivery } from 'test/factories/make-delivery'
import { makeCustomer } from 'test/factories/make-customer'

import { CEP } from '../../entities/value-objects/cep'
import { FetchDeliveriesNearbyUseCase } from '../fetch-deliveries-nearby.use-case'

let couriersRepository: InMemoryCouriersRepository
let customersRepository: InMemoryCustomersRepository
let deliveriesRepository: InMemoryDeliveriesRepository

let sut: FetchDeliveriesNearbyUseCase

describe('Use Cases: Fetch Courier Nearby', () => {
  beforeEach(() => {
    couriersRepository = new InMemoryCouriersRepository()
    customersRepository = new InMemoryCustomersRepository()
    deliveriesRepository = new InMemoryDeliveriesRepository(customersRepository)

    sut = new FetchDeliveriesNearbyUseCase(
      deliveriesRepository,
      couriersRepository,
    )
  })

  it('should list pending deliveries by city', async () => {
    const courier = makeCourier({ operationCity: 'correct-city' })
    couriersRepository.items.push(courier)

    const otherCourier = makeCourier({ operationCity: 'other-city' })
    couriersRepository.items.push(otherCourier)

    const customers = Array.from({ length: 7 }, () =>
      makeCustomer({
        address: {
          city: courier.operationCity,
          cep: CEP.createFromText(makeCEP()),
          neighborhood: 'test',
          number: '123',
          street: 'test',
          state: 'State',
        },
      }),
    )

    const otherCustomers = Array.from({ length: 3 }, () =>
      makeCustomer({
        address: {
          city: otherCourier.operationCity,
          cep: CEP.createFromText(makeCEP()),
          neighborhood: 'test',
          number: '123',
          street: 'test',
          state: 'State',
        },
      }),
    )

    customersRepository.items.push(...customers)
    customersRepository.items.push(...otherCustomers)

    for (const customer of customers) {
      deliveriesRepository.items.push(
        makeDelivery({ customerId: customer.id, status: 'PENDING' }),
      )

      deliveriesRepository.items.push(
        makeDelivery({ customerId: customer.id, status: 'PICKED_UP' }),
      )
    }

    for (const otherCustomer of otherCustomers) {
      deliveriesRepository.items.push(
        makeDelivery({ customerId: otherCustomer.id, status: 'PENDING' }),
      )
    }

    const result = await sut.execute({
      courierId: courier.id.toString(),
    })

    expect(result.isRight()).toEqual(true)

    if (result.isLeft()) throw new Error()

    expect(result.value.deliveries).toHaveLength(7)
  })
})
