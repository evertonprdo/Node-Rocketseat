import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers.repository'
import { makeCourier } from 'test/factories/make-courier'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { GetCourierUseCase } from '../get-courier.use-case'

let couriersRepository: InMemoryCouriersRepository
let sut: GetCourierUseCase

describe('Use Cases: Get courier use case', () => {
  beforeEach(() => {
    couriersRepository = new InMemoryCouriersRepository()

    sut = new GetCourierUseCase(couriersRepository)
  })

  it('should get courier', async () => {
    const courier = makeCourier()
    couriersRepository.items.push(courier)

    const result = await sut.execute({
      courierId: courier.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      courier,
    })
  })

  it('should return resource not found', async () => {
    const result = await sut.execute({
      courierId: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
