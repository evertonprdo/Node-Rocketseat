import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { Courier } from '../entities/courier'

import { CouriersRepository } from '../repositories/couriers.repository'
import { HashGenerator } from '../cryptography/hash-compare'

interface EditCourierUseCaseRequest {
  courierId: string
  name: string
  password: string
}

type EditCourierUseCaseResponse = Either<
  ResourceNotFoundError,
  { courier: Courier }
>

export class EditCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    courierId,
    name,
    password,
  }: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    courier.name = name
    courier.password = await this.hashGenerator.hash(password)

    await this.couriersRepository.save(courier)

    return right({
      courier,
    })
  }
}
