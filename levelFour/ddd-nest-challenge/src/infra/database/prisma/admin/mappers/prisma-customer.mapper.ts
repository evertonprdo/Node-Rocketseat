import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CEP } from '@/domain/_shared/entities/value-objects/cep'
import { Address } from '@/domain/_shared/entities/value-objects/address'

import { Customer } from '@/domain/admin/entities/customer'
import { Prisma, Customer as PrismaCustomer } from '@prisma/client'

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaCustomer): Customer {
    const address = new Address({
      cep: CEP.createFromText(raw.cep),
      state: raw.state,
      city: raw.city,
      street: raw.street,
      number: raw.number,
      neighborhood: raw.neighborhood,
    })

    return Customer.create(
      {
        name: raw.name,
        email: raw.email,
        address,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(customer: Customer): Prisma.CustomerUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      name: customer.name,
      email: customer.email,
      cep: customer.address.cep.value,
      state: customer.address.state,
      city: customer.address.city,
      street: customer.address.street,
      number: customer.address.number,
      neighborhood: customer.address.neighborhood,
    }
  }
}
