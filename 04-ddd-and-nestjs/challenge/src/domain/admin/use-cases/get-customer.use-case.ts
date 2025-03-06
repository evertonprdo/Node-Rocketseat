import { Either, left, right } from '@/core/either'

import { CustomersRepository } from '../repositories/customers.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { CustomerDetails } from '../entities/values-objects/customer-details'

interface GetCustomerUseCaseRequest {
  customerId: string
}

type GetCustomerUseCaseResponse = Either<
  ResourceNotFoundError,
  { customer: CustomerDetails }
>

export class GetCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    customerId,
  }: GetCustomerUseCaseRequest): Promise<GetCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findDetailsById(customerId)

    if (!customer) {
      return left(new ResourceNotFoundError())
    }

    return right({ customer })
  }
}
