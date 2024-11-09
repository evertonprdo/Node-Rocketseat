import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CEP } from '@/domain/_shared/entities/value-objects/cep'
import { Address } from '@/domain/_shared/entities/value-objects/address'

import { Customer as PrismaCustomer, User as PrismaUser } from '@prisma/client'
import { CustomerDetails } from '@/domain/admin/entities/values-objects/customer-details'
import { CPF } from '@/domain/_shared/entities/value-objects/cpf'

type PrismaCustomerDetails = {
  user: PrismaUser
} & PrismaCustomer

export class PrismaCustomerDetailsMapper {
  static toDomain(raw: PrismaCustomerDetails): CustomerDetails {
    const address = new Address({
      cep: CEP.createFromText(raw.cep),
      state: raw.state,
      city: raw.city,
      street: raw.street,
      number: raw.number,
      neighborhood: raw.neighborhood,
    })

    return CustomerDetails.create({
      userId: new UniqueEntityId(raw.userId),
      customerId: new UniqueEntityId(raw.id),
      email: raw.email,
      cpf: CPF.createFromText(raw.user.cpf),
      name: raw.user.name,
      phone: raw.user.phone,
      address,
    })
  }
}
