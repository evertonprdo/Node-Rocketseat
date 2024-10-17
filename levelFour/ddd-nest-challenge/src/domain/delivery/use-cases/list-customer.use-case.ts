import { Either, right } from '@/core/either'

import { Customer } from '../entities/customer'
import { CustomersRepository } from '../repositories/customers.repository'

interface ListCustomersUseCaseRequest {
  page: number
}

type ListCustomersUseCaseResponse = Either<null, { customer: Customer[] }>

export class ListCustomersUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    page,
  }: ListCustomersUseCaseRequest): Promise<ListCustomersUseCaseResponse> {
    const customer = await this.customersRepository.findMany({ page })

    return right({ customer })
  }
}
