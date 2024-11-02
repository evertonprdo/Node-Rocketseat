import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { DeliveryWorkersRepository } from '../repositories/delivery-workers.repository'

interface UnassignDeliveryWorkerUseCaseRequest {
  deliveryWorkerId: string
}

type UnassignDeliveryWorkerUseCaseResponse = Either<ResourceNotFoundError, null>

export class UnassignDeliveryWorkerUseCase {
  constructor(private deliveryWorkersRepository: DeliveryWorkersRepository) {}

  async execute({
    deliveryWorkerId,
  }: UnassignDeliveryWorkerUseCaseRequest): Promise<UnassignDeliveryWorkerUseCaseResponse> {
    const deliveryWorker =
      await this.deliveryWorkersRepository.findById(deliveryWorkerId)

    if (!deliveryWorker) {
      return left(new ResourceNotFoundError())
    }

    await this.deliveryWorkersRepository.unassign(deliveryWorker)

    return right(null)
  }
}
