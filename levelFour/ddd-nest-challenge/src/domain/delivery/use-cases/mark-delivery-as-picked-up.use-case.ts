import { Either, left, right } from '@/core/either'

import { Delivery } from '../entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries.repository'
import { DeliveryWorkersRepository } from '../repositories/delivery-workers.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { DeliveryAlreadyPickedUpError } from './errors/delivery-already-picked-up.error'

interface MarkDeliveryAsPickedUpRequest {
  deliveryId: string
  deliveryWorkerId: string
}

type MarkDeliveryAsPickedUpResponse = Either<
  ResourceNotFoundError | DeliveryAlreadyPickedUpError,
  { delivery: Delivery }
>

export class MarkDeliveryAsPickedUp {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private deliveryWorkersRepository: DeliveryWorkersRepository,
  ) {}

  async execute({
    deliveryId,
    deliveryWorkerId,
  }: MarkDeliveryAsPickedUpRequest): Promise<MarkDeliveryAsPickedUpResponse> {
    const deliveryWorker =
      await this.deliveryWorkersRepository.findById(deliveryWorkerId)

    if (!deliveryWorker) {
      return left(new ResourceNotFoundError())
    }

    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (delivery.status !== 'PENDING' || delivery.deliveryWorkerId) {
      return left(new DeliveryAlreadyPickedUpError(deliveryId))
    }

    delivery.markAsPickedUp(deliveryWorker.id)

    this.deliveriesRepository.save(delivery)

    return right({ delivery })
  }
}
