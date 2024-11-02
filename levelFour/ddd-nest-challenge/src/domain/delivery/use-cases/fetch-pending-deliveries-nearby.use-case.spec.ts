import { makeAddress } from '@/domain/_shared/_tests/factories/make-address'
import { makeReceiver } from '../_tests/factories/make-receiver'
import { makeDelivery } from '../_tests/factories/make-delivery'
import { makeDeliveryWorker } from '../_tests/factories/make-delivery-worker'

import { makeInMemoryDeliveriesRepository } from '../_tests/repositories/factories/make-in-memory-deliveries.repository'
import { makeInMemoryDeliveryWorkersRepository } from '../_tests/repositories/factories/make-in-memory-delivery-workers.repository'

import { InMemoryDeliveriesRepository } from '../_tests/repositories/in-memory-deliveries.repository'
import { InMemoryDeliveryWorkersRepository } from '../_tests/repositories/in-memory-delivery-workers.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { FetchPendingDeliveriesNearbyUseCase } from './fetch-pending-deliveries-nearby.use-case'

let deliveriesRepository: InMemoryDeliveriesRepository
let deliveryWorkersRepository: InMemoryDeliveryWorkersRepository

let sut: FetchPendingDeliveriesNearbyUseCase

describe('Use Case: Fetch Pending Deliveries Nearby', () => {
  beforeEach(() => {
    deliveriesRepository = makeInMemoryDeliveriesRepository()
    deliveryWorkersRepository = makeInMemoryDeliveryWorkersRepository()

    sut = new FetchPendingDeliveriesNearbyUseCase(
      deliveriesRepository,
      deliveryWorkersRepository,
    )
  })

  it('should be able to fetch pending deliveries nearby', async () => {
    const receivers = Array.from({ length: 3 }, () =>
      makeReceiver({ address: makeAddress({ city: 'test-city' }) }),
    )
    deliveriesRepository.receiversRepository.items.push(...receivers)

    const deliveryWorker = makeDeliveryWorker({ operationCity: 'test-city' })
    deliveryWorkersRepository.items.push(deliveryWorker)

    const deliveries = receivers.map((item) =>
      makeDelivery({ receiverId: item.id }),
    )
    deliveriesRepository.items.push(...deliveries)

    const result = await sut.execute({
      page: 1,
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toEqual({
      deliveries: expect.arrayContaining([
        expect.objectContaining({ receiverId: receivers[0].id }),
        expect.objectContaining({ receiverId: receivers[1].id }),
        expect.objectContaining({ receiverId: receivers[2].id }),
      ]),
    })
  })

  it('should be able to fetch paginated deliveries nearby', async () => {
    const receivers = Array.from({ length: 22 }, () =>
      makeReceiver({ address: makeAddress({ city: 'test-city' }) }),
    )
    deliveriesRepository.receiversRepository.items.push(...receivers)

    const deliveryWorker = makeDeliveryWorker({ operationCity: 'test-city' })
    deliveryWorkersRepository.items.push(deliveryWorker)

    const deliveries = receivers.map((item) =>
      makeDelivery({ receiverId: item.id }),
    )
    deliveriesRepository.items.push(...deliveries)

    const result = await sut.execute({
      page: 2,
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    expect(result.isRight()).toEqual(true)

    if (result.value instanceof ResourceNotFoundError) {
      throw new Error()
    }

    expect(result.value.deliveries).toHaveLength(2)
  })
})
