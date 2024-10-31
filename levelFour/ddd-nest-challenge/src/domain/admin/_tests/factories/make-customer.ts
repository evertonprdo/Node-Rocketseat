import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { makeAddress } from './make-address'

import { Customer, CustomerProps } from '../../entities/customer'

export function makeCustomer(
  overwrite: Partial<CustomerProps> = {},
  id?: UniqueEntityId,
) {
  const customer = Customer.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: makeAddress(),
      ...overwrite,
    },
    id,
  )

  return customer
}
