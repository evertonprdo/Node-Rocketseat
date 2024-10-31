import { Either, left, right } from '@/core/either'

import { Delivery } from '../entities/delivery'

import { CustomersRepository } from '../repositories/customers.repository'
import { DeliveriesRepository } from '../repositories/deliveries.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

interface CreateDeliveryUseCaseRequest {
  customerId: string
}

type CreateDeliveryUseCaseResponse = Either<ResourceNotFoundError, null>

export class CreateDeliveryUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private customersRepository: CustomersRepository,
  ) {}

  async execute({
    customerId,
  }: CreateDeliveryUseCaseRequest): Promise<CreateDeliveryUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      return left(new ResourceNotFoundError())
    }

    const delivery = Delivery.create({
      customerId: customer.id,
    })

    this.deliveriesRepository.create(delivery)

    return right(null)
  }
}
