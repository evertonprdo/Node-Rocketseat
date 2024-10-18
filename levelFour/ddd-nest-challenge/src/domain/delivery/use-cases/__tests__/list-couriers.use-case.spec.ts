import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers.repository'
import { makeCourier } from 'test/factories/make-courier'

import { ListCouriersUseCase } from '../list-courier.use-case'

let couriersRepository: InMemoryCouriersRepository
let sut: ListCouriersUseCase

describe('Use Cases: List couriers', () => {
  beforeEach(() => {
    couriersRepository = new InMemoryCouriersRepository()
    sut = new ListCouriersUseCase(couriersRepository)
  })

  it('should list couriers', async () => {
    const couriers = Array.from({ length: 5 }, () => makeCourier())

    couriersRepository.items.push(...couriers)

    const result = await sut.execute({ page: 1 })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.courier).toHaveLength(5)
    expect(result.value?.courier).toEqual(expect.arrayContaining(couriers))
  })

  it('should list couriers paginated', async () => {
    const couriers = Array.from({ length: 27 }, () => makeCourier())
    couriersRepository.items.push(...couriers)

    const result = await sut.execute({ page: 2 })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.courier).toHaveLength(7)
  })
})
