import { Either, left, right } from '@/core/either'

import { CustomersRepository } from '../repositories/customers.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

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
