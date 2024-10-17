import { Either, left, right } from '@/core/either'

import { Customer } from '../entities/customer'
import { CustomersRepository } from '../repositories/customers.repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

interface GetCustomerUseCaseRequest {
  customerId: string
}

type GetCustomerUseCaseResponse = Either<
  ResourceNotFoundError,
  { customer: Customer }
>

export class GetCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    customerId,
  }: GetCustomerUseCaseRequest): Promise<GetCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      return left(new ResourceNotFoundError())
    }

    return right({ customer })
  }
}
