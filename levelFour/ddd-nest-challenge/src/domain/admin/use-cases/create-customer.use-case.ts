import { Either, left, right } from '@/core/either'

import { CEP } from '@/domain/_shared/entities/value-objects/cep'
import { Address } from '@/domain/_shared/entities/value-objects/address'

import { Customer } from '../entities/customer'
import { CustomersRepository } from '../repositories/customers.repository'

import { InvalidCEPError } from './errors/invalid-cep.error'
import { EmailAlreadyInUseError } from './errors/email-already-in-use.error'

interface CreateCustomerUseCaseRequest {
  name: string
  email: string
  cep: string
  city: string
  state: string
  street: string
  number: string
  neighborhood: string
}

type CreateCustomerUseCaseResponse = Either<
  EmailAlreadyInUseError,
  {
    customer: Customer
  }
>

export class CreateCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    cep,
    city,
    email,
    name,
    neighborhood,
    number,
    state,
    street,
  }: CreateCustomerUseCaseRequest): Promise<CreateCustomerUseCaseResponse> {
    if (!CEP.isValidCEP(cep)) {
      return left(new InvalidCEPError(cep))
    }

    const customerWithSameEmail =
      await this.customersRepository.findByEmail(email)

    if (customerWithSameEmail) {
      return left(new EmailAlreadyInUseError(email))
    }

    const address = new Address({
      cep: CEP.createFromText(cep),
      city,
      neighborhood,
      number,
      state,
      street,
    })

    const customer = Customer.create({
      name,
      email,
      address,
    })

    await this.customersRepository.create(customer)

    return right({
      customer,
    })
  }
}
