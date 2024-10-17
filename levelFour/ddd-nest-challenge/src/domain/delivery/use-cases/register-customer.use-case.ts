import { Either, left, right } from '@/core/either'

import { CustomersRepository } from '../repositories/customers.repository'

import { CEP } from '@/domain/delivery/entities/value-objects/cep'
import { Customer } from '../entities/customer'

import { InvalidCEPError } from './errors/invalid-cep.error'
import { CustomerAlreadyExistError } from './errors/customer-already-exists.error'

interface RegisterCustomerUseCaseRequest {
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

type RegisterCustomerUseCaseResponse = Either<
  CustomerAlreadyExistError,
  {
    customer: Customer
  }
>

export class RegisterCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    name,
    email,
    address,
  }: RegisterCustomerUseCaseRequest): Promise<RegisterCustomerUseCaseResponse> {
    if (!CEP.isValidCEP(address.cep)) {
      return left(new InvalidCEPError(address.cep))
    }

    const customerWithSameEmail =
      await this.customersRepository.findByEmail(email)

    if (customerWithSameEmail) {
      return left(new CustomerAlreadyExistError(email))
    }

    const customerCEP = CEP.createFromText(address.cep)

    const customer = Customer.create({
      name,
      email,
      address: {
        ...address,
        cep: customerCEP,
      },
    })

    await this.customersRepository.create(customer)

    return right({ customer })
  }
}
