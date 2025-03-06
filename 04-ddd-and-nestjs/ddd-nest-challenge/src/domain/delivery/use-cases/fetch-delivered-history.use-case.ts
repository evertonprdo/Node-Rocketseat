import { Either, right } from '@/core/either'
import { DeliveriesRepository } from '../repositories/deliveries.repository'
import { Delivery } from '../entities/delivery'

interface FetchDeliveredHistoryUseCaseRequest {
  page: number
  deliveryWorkerId: string
}

type FetchDeliveredHistoryUseCaseResponse = Either<
  null,
  { deliveries: Delivery[] }
>

export class FetchDeliveredHistoryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    page,
    deliveryWorkerId,
  }: FetchDeliveredHistoryUseCaseRequest): Promise<FetchDeliveredHistoryUseCaseResponse> {
    const deliveries =
      await this.deliveriesRepository.findManyDeliveredByDeliveryWorkerId({
        page,
        deliveryWorkerId,
      })

    return right({ deliveries })
  }
}
