import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeliveryAttachment } from '../entities/delivery-attachment'
import { DeliveriesRepository } from '../repositories/deliveries.repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

interface DeliveredUseCaseRequest {
  courierId: string
  deliveryId: string
  attachmentId: string
}

type DeliveredUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeliveredUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    courierId,
    deliveryId,
    attachmentId,
  }: DeliveredUseCaseRequest): Promise<DeliveredUseCaseResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (delivery.status !== 'PICKED_UP') {
      return left(new NotAllowedError())
    }

    if (delivery.courierId?.toString() !== courierId) {
      return left(new NotAllowedError())
    }

    const deliveryAttachment = DeliveryAttachment.create({
      deliveryId: delivery.id,
      attachmentId: new UniqueEntityId(attachmentId),
    })

    delivery.markAsDelivered(deliveryAttachment)

    await this.deliveriesRepository.save(delivery)

    return right(null)
  }
}
