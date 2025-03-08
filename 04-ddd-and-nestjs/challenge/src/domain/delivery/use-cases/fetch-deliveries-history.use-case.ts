import { Either, right } from '@/core/either'
import { DeliveriesRepository } from '../repositories/deliveries.repository'
import { Delivery } from '../entities/delivery'
import { StatusKeys } from '@/domain/_shared/entities/types/delivery'

interface FetchDeliveriesHistoryUseCaseRequest {
  page: number
  deliveryWorkerId: string
  status?: StatusKeys
}

type FetchDeliveriesHistoryUseCaseResponse = Either<
  null,
  { deliveries: Delivery[] }
>

export class FetchDeliveriesHistoryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    page,
    deliveryWorkerId,
    status,
  }: FetchDeliveriesHistoryUseCaseRequest): Promise<FetchDeliveriesHistoryUseCaseResponse> {
    const deliveries =
      await this.deliveriesRepository.findManyByDeliveryWorkerId({
        page,
        deliveryWorkerId,
        status,
      })

    return right({ deliveries })
  }
}
