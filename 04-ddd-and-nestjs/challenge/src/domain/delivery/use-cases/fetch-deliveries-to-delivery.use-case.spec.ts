import { makeDelivery } from '../_tests/factories/make-delivery'
import { makeDeliveryWorker } from '../_tests/factories/make-delivery-worker'

import { InMemoryDeliveriesRepository } from '../_tests/repositories/in-memory-deliveries.repository'
import { makeInMemoryDeliveriesRepository } from '../_tests/repositories/factories/make-in-memory-deliveries.repository'

import { FetchDeliveriesToDeliveryUseCase } from './fetch-deliveries-to-delivery.use-case'

let deliveriesRepository: InMemoryDeliveriesRepository

let sut: FetchDeliveriesToDeliveryUseCase

describe('Use Cases: Fetch Delivered History', async () => {
  beforeEach(() => {
    deliveriesRepository = makeInMemoryDeliveriesRepository()

    sut = new FetchDeliveriesToDeliveryUseCase(deliveriesRepository)
  })

  it('should fetch deliveries to delivery by delivery worker', async () => {
    const deliveryWorker = makeDeliveryWorker()
    deliveriesRepository.deliveryWorkersRepository.items.push(deliveryWorker)

    const deliveries = Array.from({ length: 3 }, () =>
      makeDelivery({
        deliveredAt: new Date(),
        deliveryWorkerId: deliveryWorker.id,
        status: 'PICKED_UP',
        pickedUpAt: new Date(),
        updatedAt: new Date(),
      }),
    )
    deliveriesRepository.items.push(...deliveries)

    const result = await sut.execute({
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.deliveries).toHaveLength(3)
  })
})
