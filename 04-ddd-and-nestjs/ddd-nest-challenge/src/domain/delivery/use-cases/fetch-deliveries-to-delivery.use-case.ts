import { Either, right } from '@/core/either'

import { Delivery } from '../entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries.repository'

interface FetchDeliveriesToDeliveryUseCaseRequest {
  deliveryWorkerId: string
}

type FetchDeliveriesToDeliveryUseCaseResponse = Either<
  null,
  { deliveries: Delivery[] }
>

export class FetchDeliveriesToDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryWorkerId,
  }: FetchDeliveriesToDeliveryUseCaseRequest): Promise<FetchDeliveriesToDeliveryUseCaseResponse> {
    const deliveries =
      await this.deliveriesRepository.findManyPickedUpByDeliveryWorkerId(
        deliveryWorkerId,
      )

    return right({ deliveries })
  }
}
