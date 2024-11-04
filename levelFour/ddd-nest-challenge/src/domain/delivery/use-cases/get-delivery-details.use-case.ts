import { Either, left, right } from '@/core/either'

import { DeliveryDetails } from '../entities/value-objects/delivery-details'
import { DeliveriesRepository } from '../repositories/deliveries.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

interface GetDeliveryDetailsUseCaseRequest {
  deliveryId: string
}

type GetDeliveryDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  { delivery: DeliveryDetails }
>

export class GetDeliveryDetailsUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryId,
  }: GetDeliveryDetailsUseCaseRequest): Promise<GetDeliveryDetailsUseCaseResponse> {
    const delivery = await this.deliveriesRepository.findDetailsById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    return right({ delivery })
  }
}
