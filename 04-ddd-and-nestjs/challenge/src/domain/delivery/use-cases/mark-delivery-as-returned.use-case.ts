import { Either, left, right } from '@/core/either'

import { Delivery } from '../entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { DeliveryBeingMadeByWrongDeliveryWorkerError } from './errors/delivery-being-made-by-the-wrong-delivery-worker'

interface MarkDeliveryAsReturnedRequest {
  deliveryId: string
  deliveryWorkerId: string
}

type MarkDeliveryAsReturnedResponse = Either<
  ResourceNotFoundError,
  { delivery: Delivery }
>

export class MarkDeliveryAsReturned {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryId,
    deliveryWorkerId,
  }: MarkDeliveryAsReturnedRequest): Promise<MarkDeliveryAsReturnedResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (!delivery.deliveryWorkerId) {
      throw new Error()
    }

    if (delivery.deliveryWorkerId.toString() !== deliveryWorkerId) {
      return left(new DeliveryBeingMadeByWrongDeliveryWorkerError())
    }

    delivery.markAsReturned()
    await this.deliveriesRepository.save(delivery)

    return right({ delivery })
  }
}
