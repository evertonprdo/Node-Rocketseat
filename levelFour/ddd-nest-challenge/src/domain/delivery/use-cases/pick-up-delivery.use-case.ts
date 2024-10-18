import { Either, left, right } from '@/core/either'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { DeliveryAlreadyPickedUpError } from './errors/delivery-already-picked-up.error'

import { CouriersRepository } from '../repositories/couriers.repository'
import { DeliveriesRepository } from '../repositories/deliveries.repository'

interface PickUpUseCaseRequest {
  courierId: string
  deliveryId: string
}

type PickUpUseCaseResponse = Either<
  ResourceNotFoundError | DeliveryAlreadyPickedUpError,
  null
>

export class PickUpUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private couriersRepository: CouriersRepository,
  ) {}

  async execute({
    courierId,
    deliveryId,
  }: PickUpUseCaseRequest): Promise<PickUpUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (delivery.courierId || delivery.status !== 'PENDING') {
      return left(new DeliveryAlreadyPickedUpError(delivery.id.toString()))
    }

    delivery.markAsPickedUp(courier.id)

    await this.deliveriesRepository.save(delivery)

    return right(null)
  }
}
