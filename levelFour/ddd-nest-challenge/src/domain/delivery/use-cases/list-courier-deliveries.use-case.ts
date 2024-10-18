import { Either, right } from '@/core/either'

import { Delivery } from '../entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries.repository'

interface ListCourierDeliveriesUseCaseRequest {
  courierId: string
  page: number
}

type ListCourierDeliveriesUseCaseResponse = Either<
  null,
  { deliveries: Delivery[] }
>

export class ListCourierDeliveriesUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    courierId,
    page,
  }: ListCourierDeliveriesUseCaseRequest): Promise<ListCourierDeliveriesUseCaseResponse> {
    const deliveries = await this.deliveriesRepository.findManyByCourierId({
      courierId,
      page,
    })

    return right({ deliveries })
  }
}
