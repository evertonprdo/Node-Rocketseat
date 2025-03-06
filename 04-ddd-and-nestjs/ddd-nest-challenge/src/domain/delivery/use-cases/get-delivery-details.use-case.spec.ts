import { makeDelivery } from '../_tests/factories/make-delivery'
import { makeReceiver } from '../_tests/factories/make-receiver'

import { InMemoryDeliveriesRepository } from '../_tests/repositories/in-memory-deliveries.repository'
import { makeInMemoryDeliveriesRepository } from '../_tests/repositories/factories/make-in-memory-deliveries.repository'

import { GetDeliveryDetailsUseCase } from './get-delivery-details.use-case'

let deliveriesRepository: InMemoryDeliveriesRepository

let sut: GetDeliveryDetailsUseCase

describe('Use Case: Get Delivery Details', () => {
  beforeEach(() => {
    deliveriesRepository = makeInMemoryDeliveriesRepository()

    sut = new GetDeliveryDetailsUseCase(deliveriesRepository)
  })

  it('should get delivery details', async () => {
    const receiver = makeReceiver()
    deliveriesRepository.receiversRepository.items.push(receiver)

    const delivery = makeDelivery({ receiverId: receiver.id })
    deliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toEqual({
      delivery: expect.objectContaining({
        receiver: expect.objectContaining({
          name: receiver.name,
          address: receiver.address,
        }),
      }),
    })
  })
})
