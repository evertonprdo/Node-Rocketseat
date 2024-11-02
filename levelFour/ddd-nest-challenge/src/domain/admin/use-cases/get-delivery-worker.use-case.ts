import { Either, left, right } from '@/core/either'

import { DeliveryWorkerDetails } from '../entities/values-objects/delivery-worker-details'
import { DeliveryWorkersRepository } from '../repositories/delivery-workers.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

interface GetDeliveryWorkerUseCaseRequest {
  deliveryWorkerId: string
}

type GetDeliveryWorkerUseCaseResponse = Either<
  ResourceNotFoundError,
  { deliveryWorker: DeliveryWorkerDetails }
>

export class GetDeliveryWorkerUseCase {
  constructor(private deliveryWorkersRepository: DeliveryWorkersRepository) {}

  async execute({
    deliveryWorkerId,
  }: GetDeliveryWorkerUseCaseRequest): Promise<GetDeliveryWorkerUseCaseResponse> {
    const deliveryWorker =
      await this.deliveryWorkersRepository.findDetailsById(deliveryWorkerId)

    if (!deliveryWorker) {
      return left(new ResourceNotFoundError())
    }

    return right({ deliveryWorker })
  }
}
