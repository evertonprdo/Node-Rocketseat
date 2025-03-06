import { Either, left, right } from '@/core/either'

import { DeliveriesRepository } from '../repositories/deliveries.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

interface DeleteDeliveryUseCaseRequest {
  deliveryId: string
}

type DeleteDeliveryUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryId,
  }: DeleteDeliveryUseCaseRequest): Promise<DeleteDeliveryUseCaseResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    await this.deliveriesRepository.delete(delivery)

    return right(null)
  }
}
