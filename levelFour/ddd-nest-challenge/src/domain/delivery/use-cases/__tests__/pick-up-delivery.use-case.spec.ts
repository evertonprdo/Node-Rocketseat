import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries.repository'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers.repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'

import { makeCourier } from 'test/factories/make-courier'
import { makeDelivery } from 'test/factories/make-delivery'

import { PickUpUseCase } from '../pick-up-delivery.use-case'

let customersRepository: InMemoryCustomersRepository
let couriersRepository: InMemoryCouriersRepository
let deliveriesRepository: InMemoryDeliveriesRepository

let sut: PickUpUseCase

describe('Use Cases: Pick Up delivery', () => {
  beforeEach(() => {
    couriersRepository = new InMemoryCouriersRepository()
    deliveriesRepository = new InMemoryDeliveriesRepository(customersRepository)

    customersRepository = new InMemoryCustomersRepository()

    sut = new PickUpUseCase(deliveriesRepository, couriersRepository)
  })

  it('should pick up a delivery', async () => {
    const courier = makeCourier()
    couriersRepository.items.push(courier)

    const delivery = makeDelivery({ status: 'PENDING' })
    deliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      deliveryId: delivery.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(deliveriesRepository.items[0]).toMatchObject({
      status: 'PICKED_UP',
      courierId: courier.id,
      pickedUpDate: expect.any(Date),
    })
  })
})
