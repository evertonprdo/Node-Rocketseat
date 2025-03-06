import { Either, left, right } from '@/core/either'

import { DeliveryWorker } from '../entities/delivery-worker'
import { DeliveryWorkersRepository } from '../repositories/delivery-workers.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

interface EditDeliveryWorkerUseCaseRequest {
  deliveryWorkerId: string
  operationZone: string
}

type EditDeliveryWorkerUseCaseResponse = Either<
  ResourceNotFoundError,
  { deliveryWorker: DeliveryWorker }
>

export class EditDeliveryWorkerUseCase {
  constructor(private deliveryWorkersRepository: DeliveryWorkersRepository) {}

  async execute({
    deliveryWorkerId,
    operationZone,
  }: EditDeliveryWorkerUseCaseRequest): Promise<EditDeliveryWorkerUseCaseResponse> {
    const deliveryWorker =
      await this.deliveryWorkersRepository.findById(deliveryWorkerId)

    if (!deliveryWorker) {
      return left(new ResourceNotFoundError())
    }

    deliveryWorker.operationZone = operationZone

    await this.deliveryWorkersRepository.save(deliveryWorker)

    return right({ deliveryWorker })
  }
}
