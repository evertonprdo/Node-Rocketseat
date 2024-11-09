import { Either, left, right } from '@/core/either'

import { CustomersRepository } from '../repositories/customers.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

interface UnassignCustomerUseCaseRequest {
  customerId: string
}

type UnassignCustomerUseCaseResponse = Either<ResourceNotFoundError, null>

export class UnassignCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    customerId,
  }: UnassignCustomerUseCaseRequest): Promise<UnassignCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      return left(new ResourceNotFoundError())
    }

    await this.customersRepository.delete(customer)

    return right(null)
  }
}
