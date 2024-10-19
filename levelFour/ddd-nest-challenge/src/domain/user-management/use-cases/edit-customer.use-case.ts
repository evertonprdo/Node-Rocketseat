import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { CEP } from '@/domain/delivery/entities/value-objects/cep'
import { Customer } from '../entities/customer'

import { CustomersRepository } from '../repositories/customers.repository'

import { InvalidCEPError } from './errors/invalid-cep.error'

interface EditCustomerUseCaseRequest {
  customerId: string
  name: string
  email: string
  address: {
    cep: string
    state: string
    city: string
    street: string
    number: string
    neighborhood: string
  }
}

type EditCustomerUseCaseResponse = Either<
  ResourceNotFoundError | InvalidCEPError,
  { customer: Customer }
>

export class EditCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    customerId,
    name,
    email,
    address,
  }: EditCustomerUseCaseRequest): Promise<EditCustomerUseCaseResponse> {
    if (!CEP.isValidCEP(address.cep)) {
      return left(new InvalidCEPError(address.cep))
    }

    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      return left(new ResourceNotFoundError())
    }

    customer.name = name
    customer.email = email
    customer.address = {
      ...address,
      cep: CEP.createFromText(address.cep),
    }

    await this.customersRepository.save(customer)

    return right({
      customer,
    })
  }
}
