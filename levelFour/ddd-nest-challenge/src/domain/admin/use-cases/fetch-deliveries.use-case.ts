import { Either, right } from '@/core/either'

import { Delivery } from '../entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries.repository'

interface FetchDeliveriesUseCaseRequest {
  page: number
}

type FetchDeliveriesUseCaseResponse = Either<null, { deliveries: Delivery[] }>

export class FetchDeliveriesUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    page,
  }: FetchDeliveriesUseCaseRequest): Promise<FetchDeliveriesUseCaseResponse> {
    const deliveries = await this.deliveriesRepository.findMany({ page })

    return right({ deliveries })
  }
}
