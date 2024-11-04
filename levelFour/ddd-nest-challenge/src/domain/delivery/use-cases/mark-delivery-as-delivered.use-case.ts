import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeliveryAttachment } from '@/domain/_shared/entities/delivery-attachment'

import { Delivery } from '../entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { DeliveryWrongStatusError } from './errors/delivery-wrong-status.error'
import { DeliveryBeingMadeByWrongDeliveryWorkerError } from './errors/delivery-being-made-by-the-wrong-delivery-worker'

interface MarkDeliveryAsDeliveredRequest {
  deliveryId: string
  deliveryWorkerId: string
  attachmentId: string
}

type MarkDeliveryAsDeliveredResponse = Either<
  ResourceNotFoundError,
  { delivery: Delivery }
>

export class MarkDeliveryAsDelivered {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryId,
    deliveryWorkerId,
    attachmentId,
  }: MarkDeliveryAsDeliveredRequest): Promise<MarkDeliveryAsDeliveredResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (delivery.status !== 'PICKED_UP') {
      return left(new DeliveryWrongStatusError(delivery.status))
    }

    if (!delivery.deliveryWorkerId) {
      throw new Error()
    }

    if (delivery.deliveryWorkerId.toString() !== deliveryWorkerId) {
      return left(new DeliveryBeingMadeByWrongDeliveryWorkerError())
    }

    const attachment = DeliveryAttachment.create({
      attachmentId: new UniqueEntityId(attachmentId),
      deliveryId: delivery.id,
    })

    delivery.markAsDelivered(attachment)
    await this.deliveriesRepository.save(delivery)

    return right({ delivery })
  }
}
