import { Either, right } from '@/core/either'

import { Delivery } from '../entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries.repository'

interface ListDeliveriesUseCaseRequest {
  page: number
}

type ListDeliveriesUseCaseResponse = Either<null, { delivery: Delivery[] }>

export class ListDeliveriesUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    page,
  }: ListDeliveriesUseCaseRequest): Promise<ListDeliveriesUseCaseResponse> {
    const delivery = await this.deliveriesRepository.findMany({ page })

    return right({ delivery })
  }
}
