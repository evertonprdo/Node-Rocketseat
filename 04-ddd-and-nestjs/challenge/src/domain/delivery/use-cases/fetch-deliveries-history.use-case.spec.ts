import { makeDelivery } from '../_tests/factories/make-delivery'
import { makeDeliveryWorker } from '../_tests/factories/make-delivery-worker'

import { InMemoryDeliveriesRepository } from '../_tests/repositories/in-memory-deliveries.repository'
import { makeInMemoryDeliveriesRepository } from '../_tests/repositories/factories/make-in-memory-deliveries.repository'

import { FetchDeliveriesHistoryUseCase } from './fetch-deliveries-history.use-case'

let deliveriesRepository: InMemoryDeliveriesRepository

let sut: FetchDeliveriesHistoryUseCase

describe('Use Cases: Fetch Delivered History', async () => {
  beforeEach(() => {
    deliveriesRepository = makeInMemoryDeliveriesRepository()

    sut = new FetchDeliveriesHistoryUseCase(deliveriesRepository)
  })

  it('should fetch the delivery worker deliveries history filtered by status', async () => {
    const deliveryWorker = makeDeliveryWorker()
    deliveriesRepository.deliveryWorkersRepository.items.push(deliveryWorker)

    const deliveryCommonProps = {
      deliveryWorkerId: deliveryWorker.id,
      status: 'DELIVERED',
      pickedUpAt: new Date(),
      updatedAt: new Date(),
    }

    const deliveryPickedUp = makeDelivery({
      ...deliveryCommonProps,
      status: 'PICKED_UP',
    })

    const deliveryDelivered = makeDelivery({
      ...deliveryCommonProps,
      deliveredAt: new Date(),
      status: 'DELIVERED',
    })

    const deliveryReturned = makeDelivery({
      ...deliveryCommonProps,
      status: 'RETURNED',
    })

    deliveriesRepository.items.push(
      deliveryPickedUp,
      deliveryDelivered,
      deliveryReturned,
    )

    const requestCommonProps = {
      page: 1,
      deliveryWorkerId: deliveryWorker.id.toString(),
    }

    const result = await sut.execute(requestCommonProps)

    const resultPickedUp = await sut.execute({
      ...requestCommonProps,
      status: 'PICKED_UP',
    })

    const resultDelivered = await sut.execute({
      ...requestCommonProps,
      status: 'DELIVERED',
    })

    const resultReturned = await sut.execute({
      ...requestCommonProps,
      status: 'RETURNED',
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.deliveries).toHaveLength(3)

    expect(resultPickedUp.isRight()).toEqual(true)
    expect(resultPickedUp.value?.deliveries).toHaveLength(1)
    expect(resultPickedUp.value?.deliveries[0].status).toEqual('PICKED_UP')

    expect(resultDelivered.isRight()).toEqual(true)
    expect(resultPickedUp.value?.deliveries).toHaveLength(1)
    expect(resultDelivered.value?.deliveries[0].status).toEqual('DELIVERED')

    expect(resultReturned.isRight()).toEqual(true)
    expect(resultPickedUp.value?.deliveries).toHaveLength(1)
    expect(resultReturned.value?.deliveries[0].status).toEqual('RETURNED')
  })

  it('should fetch the delivery worker deliveries history', async () => {
    const deliveryWorker = makeDeliveryWorker()
    deliveriesRepository.deliveryWorkersRepository.items.push(deliveryWorker)

    const deliveries = Array.from({ length: 3 }, () =>
      makeDelivery({
        deliveredAt: new Date(),
        deliveryWorkerId: deliveryWorker.id,
        status: 'DELIVERED',
        pickedUpAt: new Date(),
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

  it('should fetch the delivery worker deliveries history paginated', async () => {
    const deliveryWorker = makeDeliveryWorker()
    deliveriesRepository.deliveryWorkersRepository.items.push(deliveryWorker)

    const deliveries = Array.from({ length: 22 }, () =>
      makeDelivery({
        deliveredAt: new Date(),
        deliveryWorkerId: deliveryWorker.id,
        status: 'DELIVERED',
        pickedUpAt: new Date(),
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
