import { Either, right } from '@/core/either'

import { Courier } from '../entities/courier'
import { CouriersRepository } from '../repositories/couriers.repository'

interface ListCouriersUseCaseRequest {
  page: number
}

type ListCouriersUseCaseResponse = Either<null, { courier: Courier[] }>

export class ListCouriersUseCase {
  constructor(private couriersRepository: CouriersRepository) {}

  async execute({
    page,
  }: ListCouriersUseCaseRequest): Promise<ListCouriersUseCaseResponse> {
    const courier = await this.couriersRepository.findMany({ page })

    return right({ courier })
  }
}
