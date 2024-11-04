import { makeDelivery } from '../_tests/factories/make-delivery'
import { makeDeliveryWorker } from '../_tests/factories/make-delivery-worker'

import { InMemoryDeliveriesRepository } from '../_tests/repositories/in-memory-deliveries.repository'
import { makeInMemoryDeliveriesRepository } from '../_tests/repositories/factories/make-in-memory-deliveries.repository'

import { FetchDeliveredHistoryUseCase } from './fetch-delivered-history.use-case'

let deliveriesRepository: InMemoryDeliveriesRepository

let sut: FetchDeliveredHistoryUseCase

describe('Use Cases: Fetch Delivered History', async () => {
  beforeEach(() => {
    deliveriesRepository = makeInMemoryDeliveriesRepository()

    sut = new FetchDeliveredHistoryUseCase(deliveriesRepository)
  })

  it('should fetch the delivered history of a delivery worker', async () => {
    const deliveryWorker = makeDeliveryWorker()
    deliveriesRepository.deliveryWorkersRepository.items.push(deliveryWorker)

    const deliveries = Array.from({ length: 3 }, () =>
      makeDelivery({
        deliveredAt: new Date(),
        deliveryWorkerId: deliveryWorker.id,
        status: 'DELIVERED',
        pickedUpDate: new Date(),
        updatedAt: new Date(),
      }),
    )
    deliveriesRepository.items.push(...deliveries)

    const result = await sut.execute({
      page: 1,
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.deliveries).toHaveLength(3)
  })

  it('should fetch the delivered history of a delivery worker paginated', async () => {
    const deliveryWorker = makeDeliveryWorker()
    deliveriesRepository.deliveryWorkersRepository.items.push(deliveryWorker)

    const deliveries = Array.from({ length: 22 }, () =>
      makeDelivery({
        deliveredAt: new Date(),
        deliveryWorkerId: deliveryWorker.id,
        status: 'DELIVERED',
        pickedUpDate: new Date(),
        updatedAt: new Date(),
      }),
    )
    deliveriesRepository.items.push(...deliveries)

    const result = await sut.execute({
      page: 2,
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.deliveries).toHaveLength(2)
  })
})
