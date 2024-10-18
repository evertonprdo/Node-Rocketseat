import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { DeliveriesRepository } from '../repositories/deliveries.repository'
import { CouriersRepository } from '../repositories/couriers.repository'

import { Delivery } from '../entities/delivery'

interface FetchDeliveriesNearbyUseCaseRequest {
  courierId: string
}

type FetchDeliveriesNearbyUseCaseResponse = Either<
  ResourceNotFoundError,
  { deliveries: Delivery[] }
>

export class FetchDeliveriesNearbyUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private couriersRepository: CouriersRepository,
  ) {}

  async execute({
    courierId,
  }: FetchDeliveriesNearbyUseCaseRequest): Promise<FetchDeliveriesNearbyUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    const deliveries = await this.deliveriesRepository.findManyPendingByCity(
      courier.operationCity,
    )

    return right({ deliveries })
  }
}
