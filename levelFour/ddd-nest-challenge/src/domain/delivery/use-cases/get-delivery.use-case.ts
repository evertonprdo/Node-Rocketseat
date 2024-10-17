import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { Delivery } from '../entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries.repository'

interface GetDeliveryUseCaseRequest {
  deliveryId: string
}

type GetDeliveryUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    delivery: Delivery
  }
>

export class GetDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryId,
  }: GetDeliveryUseCaseRequest): Promise<GetDeliveryUseCaseResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    return right({ delivery })
  }
}
