import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { DeliveriesRepository } from '../repositories/deliveries.repository'
import { DeliveryWithCustomer } from '../entities/value-objects/delivery-with-customer'

interface GetDeliveryUseCaseRequest {
  deliveryId: string
}

type GetDeliveryUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    delivery: DeliveryWithCustomer
  }
>

export class GetDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryId,
  }: GetDeliveryUseCaseRequest): Promise<GetDeliveryUseCaseResponse> {
    const delivery =
      await this.deliveriesRepository.findByIdWithCustomer(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    return right({ delivery })
  }
}
