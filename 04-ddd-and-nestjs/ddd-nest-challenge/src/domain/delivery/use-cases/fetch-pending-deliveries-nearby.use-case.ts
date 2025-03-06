import { Either, left, right } from '@/core/either'

import { Delivery } from '../entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries.repository'
import { DeliveryWorkersRepository } from '../repositories/delivery-workers.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

interface FetchPendingDeliveriesNearbyUseCaseRequest {
  page: number
  deliveryWorkerId: string
}

type FetchPendingDeliveriesNearbyUseCaseResponse = Either<
  ResourceNotFoundError,
  { deliveries: Delivery[] }
>

export class FetchPendingDeliveriesNearbyUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private deliveryWorkersRepository: DeliveryWorkersRepository,
  ) {}

  async execute({
    page,
    deliveryWorkerId,
  }: FetchPendingDeliveriesNearbyUseCaseRequest): Promise<FetchPendingDeliveriesNearbyUseCaseResponse> {
    const deliveryWorker =
      await this.deliveryWorkersRepository.findById(deliveryWorkerId)

    if (!deliveryWorker) {
      return left(new ResourceNotFoundError())
    }

    const deliveries = await this.deliveriesRepository.findManyPendingByCity({
      city: deliveryWorker.operationCity,
      page,
    })

    return right({ deliveries })
  }
}
