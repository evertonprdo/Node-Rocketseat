import { Either, left, right } from '@/core/either'

import { DeliveryWorker } from '../entities/delivery-worker'

import { UsersRepository } from '../repositories/users.repository'
import { DeliveryWorkersRepository } from '../repositories/delivery-workers.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

interface AssignDeliveryWorkerUseCaseRequest {
  userId: string
  operationZone: string
}

type AssignDeliveryWorkerUseCaseResponse = Either<ResourceNotFoundError, null>

export class AssignDeliveryWorkerUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private deliveryWorkersRepository: DeliveryWorkersRepository,
  ) {}

  async execute({
    userId,
    operationZone,
  }: AssignDeliveryWorkerUseCaseRequest): Promise<AssignDeliveryWorkerUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const deliveryWorker = DeliveryWorker.create({
      userId: user.id,
      operationZone,
    })

    await this.deliveryWorkersRepository.assign(deliveryWorker)

    return right(null)
  }
}
