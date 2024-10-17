import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { CustomersRepository } from '../repositories/customers.repository'
import { DeliveriesRepository } from '../repositories/deliveries.repository'

import { Delivery } from '../entities/delivery'

interface CreateDeliveryUseCaseRequest {
  customerId: string
}

type CreateDeliveryUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    delivery: Delivery
  }
>

export class CreateDeliveryUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private customersRepository: CustomersRepository,
  ) {}

  async execute({
    customerId,
  }: CreateDeliveryUseCaseRequest): Promise<CreateDeliveryUseCaseResponse> {
    const costumer = await this.customersRepository.findById(customerId)

    if (!costumer) {
      return left(new ResourceNotFoundError())
    }

    const delivery = Delivery.create({
      customerId: costumer.id,
    })

    await this.deliveriesRepository.create(delivery)

    return right({ delivery })
  }
}
