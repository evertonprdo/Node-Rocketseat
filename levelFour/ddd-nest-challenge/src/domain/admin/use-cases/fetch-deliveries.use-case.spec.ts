import { makeDelivery } from '../_tests/factories/make-delivery'
import { makeInMemoryDeliveriesRepository } from '../_tests/repositories/factories/make-in-memory-deliveries-repository'

import { InMemoryDeliveriesRepository } from '../_tests/repositories/in-memory-deliveries.repository'

import { FetchDeliveriesUseCase } from './fetch-deliveries.use-case'

let deliveriesRepository: InMemoryDeliveriesRepository

let sut: FetchDeliveriesUseCase

describe('Use Cases: Fetch Deliveries', () => {
  beforeEach(() => {
    deliveriesRepository = makeInMemoryDeliveriesRepository()

    sut = new FetchDeliveriesUseCase(deliveriesRepository)
  })

  it('should fetch deliveries', async () => {
    deliveriesRepository.items.push(makeDelivery())
    deliveriesRepository.items.push(makeDelivery())
    deliveriesRepository.items.push(makeDelivery())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.deliveries).toHaveLength(3)
  })

  it('should be able to fetch paginated deliveries', async () => {
    for (let i = 0; i < 22; i++) {
      deliveriesRepository.items.push(makeDelivery())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveries).toHaveLength(2)
  })
})
