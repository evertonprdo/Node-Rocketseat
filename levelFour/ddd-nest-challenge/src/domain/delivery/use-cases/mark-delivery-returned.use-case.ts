import { Either, left, right } from '@/core/either'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { DeliveriesRepository } from '../repositories/deliveries.repository'

interface MarkDeliveryReturnedUseCaseRequest {
  deliveryId: string
}

type MarkDeliveryReturnedUseCaseResponse = Either<ResourceNotFoundError, null>

export class MarkDeliveryReturnedUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryId,
  }: MarkDeliveryReturnedUseCaseRequest): Promise<MarkDeliveryReturnedUseCaseResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    delivery.markAsReturned()

    await this.deliveriesRepository.save(delivery)

    return right(null)
  }
}
