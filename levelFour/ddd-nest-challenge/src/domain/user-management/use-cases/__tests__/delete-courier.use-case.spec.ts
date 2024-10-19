import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers.repository'
import { makeCourier } from 'test/factories/make-courier'

import { DeleteCourierUseCase } from '../delete-courier.use-case'

let couriersRepository: InMemoryCouriersRepository
let sut: DeleteCourierUseCase

describe('Use Cases: Delete Courier', () => {
  beforeEach(() => {
    couriersRepository = new InMemoryCouriersRepository()

    sut = new DeleteCourierUseCase(couriersRepository)
  })

  it('should delete a courier', async () => {
    const courier = makeCourier()
    couriersRepository.items.push(courier)

    const result = await sut.execute({ courierId: courier.id.toString() })

    expect(result.isRight()).toEqual(true)
    expect(couriersRepository.items).toHaveLength(0)
  })
})
