import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { CustomersRepository } from '../repositories/customers.repository'

interface DeleteCustomerUseCaseRequest {
  customerId: string
}

type DeleteCustomerUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    customerId,
  }: DeleteCustomerUseCaseRequest): Promise<DeleteCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      return left(new ResourceNotFoundError())
    }

    await this.customersRepository.delete(customer)

    return right(null)
  }
}
