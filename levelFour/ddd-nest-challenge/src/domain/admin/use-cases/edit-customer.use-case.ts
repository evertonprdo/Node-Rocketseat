import { Either, left, right } from '@/core/either'

import { CEP } from '@/domain/_shared/entities/value-objects/cep'
import { Address } from '@/domain/_shared/entities/value-objects/address'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { InvalidCEPError } from '@/domain/delivery/use-cases/errors/invalid-cep.error'

import { Customer } from '../entities/customer'
import { CustomersRepository } from '../repositories/customers.repository'

interface EditCustomerUseCaseRequest {
  customerId: string
  name: string
  cep: string
  city: string
  state: string
  street: string
  number: string
  neighborhood: string
}

type EditCustomerUseCaseResponse = Either<
  ResourceNotFoundError | InvalidCEPError,
  {
    customer: Customer
  }
>

export class EditCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    customerId,
    name,
    city,
    cep,
    neighborhood,
    number,
    state,
    street,
  }: EditCustomerUseCaseRequest): Promise<EditCustomerUseCaseResponse> {
    if (!CEP.isValidCEP(cep)) {
      return left(new InvalidCEPError(cep))
    }

    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      return left(new ResourceNotFoundError())
    }

    const newAddress = new Address({
      cep: CEP.createFromText(cep),
      city,
      neighborhood,
      number,
      state,
      street,
    })

    customer.name = name
    customer.address = newAddress

    this.customersRepository.save(customer)

    return right({
      customer,
    })
  }
}
