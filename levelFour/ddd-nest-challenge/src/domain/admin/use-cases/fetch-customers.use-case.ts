import { Either, right } from '@/core/either'

import { Customer } from '../entities/customer'
import { CustomersRepository } from '../repositories/customers.repository'

interface FetchCustomersUseCaseRequest {
  page: number
}

type FetchCustomersUseCaseResponse = Either<null, { customers: Customer[] }>

export class FetchCustomersUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    page,
  }: FetchCustomersUseCaseRequest): Promise<FetchCustomersUseCaseResponse> {
    const customers = await this.customersRepository.findMany({ page })

    return right({ customers })
  }
}
