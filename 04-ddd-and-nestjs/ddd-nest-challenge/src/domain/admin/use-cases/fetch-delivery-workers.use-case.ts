import { Either, right } from '@/core/either'

import { DeliveryWorkerDetails } from '../entities/values-objects/delivery-worker-details'
import { DeliveryWorkersRepository } from '../repositories/delivery-workers.repository'

interface FetchDeliveryWorkersUseCaseRequest {
  page: number
}

type FetchDeliveryWorkersUseCaseResponse = Either<
  null,
  { deliveryWorkers: DeliveryWorkerDetails[] }
>

export class FetchDeliveryWorkersUseCase {
  constructor(private deliveryWorkersRepository: DeliveryWorkersRepository) {}

  async execute({
    page,
  }: FetchDeliveryWorkersUseCaseRequest): Promise<FetchDeliveryWorkersUseCaseResponse> {
    const deliveryWorkers =
      await this.deliveryWorkersRepository.findManyDetails({ page })

    return right({ deliveryWorkers })
  }
}
