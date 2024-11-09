import { Either, left, right } from '@/core/either'

import { CEP } from '@/domain/_shared/entities/value-objects/cep'
import { Address } from '@/domain/_shared/entities/value-objects/address'

import { Customer } from '../entities/customer'
import { CustomersRepository } from '../repositories/customers.repository'

import { InvalidCEPError } from './errors/invalid-cep.error'
import { EmailAlreadyInUseError } from './errors/email-already-in-use.error'
import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { UsersRepository } from '../repositories/users.repository'
import { UserAlreadyAssignedError } from './errors/user-already-assigned.error'

interface AssignCustomerUseCaseRequest {
  userId: string
  email: string
  cep: string
  city: string
  state: string
  street: string
  number: string
  neighborhood: string
}

type AssignCustomerUseCaseResponse = Either<
  | InvalidCEPError
  | EmailAlreadyInUseError
  | ResourceNotFoundError
  | UserAlreadyAssignedError,
  {
    customer: Customer
  }
>

export class AssignCustomerUseCase {
  constructor(
    private customersRepository: CustomersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    cep,
    city,
    email,
    neighborhood,
    number,
    state,
    street,
  }: AssignCustomerUseCaseRequest): Promise<AssignCustomerUseCaseResponse> {
    if (!CEP.isValidCEP(cep)) {
      return left(new InvalidCEPError(cep))
    }

    const customerWithSameEmail =
      await this.customersRepository.findByEmail(email)

    if (customerWithSameEmail) {
      return left(new EmailAlreadyInUseError(email))
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const customerWithSameUseId = await this.customersRepository.findByUserId(
      user.id.toString(),
    )

    if (customerWithSameUseId) {
      return left(new UserAlreadyAssignedError('CUSTOMER'))
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
      userId: user.id,
      email,
      address,
    })

    await this.customersRepository.create(customer)

    return right({
      customer,
    })
  }
}
