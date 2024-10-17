import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries.repository'
import { makeDelivery } from 'test/factories/make-delivery'

import { ListDeliveriesUseCase } from '../list-deliveries.use-case'

let deliveriesRepository: InMemoryDeliveriesRepository
let sut: ListDeliveriesUseCase

describe('Use Cases: List deliveries', () => {
  beforeEach(() => {
    deliveriesRepository = new InMemoryDeliveriesRepository()
    sut = new ListDeliveriesUseCase(deliveriesRepository)
  })

  it('should list deliveries', async () => {
    const deliveries = Array.from({ length: 5 }, () => makeDelivery())

    deliveriesRepository.items.push(...deliveries)

    const result = await sut.execute({ page: 1 })

    expect(result.isRight()).toEqual(true)
    expect(result.value.delivery).toHaveLength(5)
    expect(result.value.delivery).toEqual(expect.arrayContaining(deliveries))
  })

  it('should list deliveries paginated', async () => {
    const deliveries = Array.from({ length: 27 }, () => makeDelivery())
    deliveriesRepository.items.push(...deliveries)

    const result = await sut.execute({ page: 2 })

    expect(result.isRight()).toEqual(true)
    expect(result.value.delivery).toHaveLength(7)
  })
})
