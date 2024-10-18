import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers.repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers.repository'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries.repository'

import { makeCourier } from 'test/factories/make-courier'
import { makeDelivery } from 'test/factories/make-delivery'

import { DeliveredUseCase } from '../delivered.use-case'
import { makeDeliveryAttachment } from 'test/factories/make-delivery-attachment'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let customersRepository: InMemoryCustomersRepository
let couriersRepository: InMemoryCouriersRepository
let deliveriesRepository: InMemoryDeliveriesRepository

let sut: DeliveredUseCase

describe('Use Cases: Delivered', () => {
  beforeEach(() => {
    couriersRepository = new InMemoryCouriersRepository()
    deliveriesRepository = new InMemoryDeliveriesRepository(customersRepository)

    customersRepository = new InMemoryCustomersRepository()

    sut = new DeliveredUseCase(deliveriesRepository)
  })

  it('should mark as delivered', async () => {
    const courier = makeCourier()
    couriersRepository.items.push(courier)

    const delivery = makeDelivery({
      status: 'PICKED_UP',
      courierId: courier.id,
    })

    deliveriesRepository.items.push(delivery)

    const deliveryAttachment = makeDeliveryAttachment()

    const result = await sut.execute({
      courierId: courier.id.toString(),
      deliveryId: delivery.id.toString(),
      attachmentId: deliveryAttachment.attachmentId.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(deliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        status: 'DELIVERED',
        courierId: courier.id,
        deliveredAt: expect.any(Date),
        deliveryAttachment: expect.objectContaining({
          attachmentId: deliveryAttachment.attachmentId,
        }),
      }),
    )
  })

  it('should not be able to mark as delivered by other courier', async () => {
    const courier = makeCourier()
    const otherCourier = makeCourier()

    couriersRepository.items.push(courier)
    couriersRepository.items.push(otherCourier)

    const delivery = makeDelivery({
      status: 'PICKED_UP',
      courierId: courier.id,
    })

    deliveriesRepository.items.push(delivery)

    const deliveryAttachment = makeDeliveryAttachment()

    const result = await sut.execute({
      courierId: otherCourier.id.toString(),
      deliveryId: delivery.id.toString(),
      attachmentId: deliveryAttachment.attachmentId.toString(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
