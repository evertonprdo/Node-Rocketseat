import { Either, left, right } from '@/core/either'

import { DeliveryWorker } from '../entities/delivery-worker'

import { UsersRepository } from '../repositories/users.repository'
import { DeliveryWorkersRepository } from '../repositories/delivery-workers.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { UserAlreadyAssignedError } from './errors/user-already-assigned.error'

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

    const isUserAlreadyDeliveryWorker =
      await this.deliveryWorkersRepository.findByUserId(userId)

    if (isUserAlreadyDeliveryWorker) {
      return left(new UserAlreadyAssignedError('DELIVERY_WORKER'))
    }

    const deliveryWorker = DeliveryWorker.create({
      userId: user.id,
      operationZone,
    })

    await this.deliveryWorkersRepository.assign(deliveryWorker)

    return right(null)
  }
}
