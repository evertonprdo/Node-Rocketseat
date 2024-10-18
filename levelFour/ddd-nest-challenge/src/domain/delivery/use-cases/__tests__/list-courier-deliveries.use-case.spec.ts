import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries.repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'

import { makeCourier } from 'test/factories/make-courier'
import { makeDelivery } from 'test/factories/make-delivery'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ListCourierDeliveriesUseCase } from '../list-courier-deliveries.use-case'

let customersRepository: InMemoryCustomersRepository
let deliveriesRepository: InMemoryDeliveriesRepository

let sut: ListCourierDeliveriesUseCase

describe('Use Cases: List Courier deliveries', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    deliveriesRepository = new InMemoryDeliveriesRepository(customersRepository)

    sut = new ListCourierDeliveriesUseCase(deliveriesRepository)
  })

  it('should return the list of deliveries of a courier', async () => {
    const courier = makeCourier()

    Array.from({ length: 7 }, () =>
      deliveriesRepository.items.push(
        makeDelivery({ courierId: new UniqueEntityId('wrong-id') }),
      ),
    )

    Array.from({ length: 9 }, () =>
      deliveriesRepository.items.push(makeDelivery({ courierId: courier.id })),
    )

    const result = await sut.execute({
      courierId: courier.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveries).toHaveLength(9)

    expect(result.value?.deliveries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          courierId: courier.id,
        }),
        expect.not.objectContaining({
          courierId: new UniqueEntityId('wrong-id'),
        }),
      ]),
    )
  })
})
