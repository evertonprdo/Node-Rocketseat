import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Customer, CustomerProps } from '../../entities/customer'
import { makeAddress } from '@/domain/_shared/_tests/factories/make-address'

export function makeCustomer(
  overwrite: Partial<CustomerProps> = {},
  id?: UniqueEntityId,
) {
  const customer = Customer.create(
    {
      userId: new UniqueEntityId(),
      email: faker.internet.email(),
      address: makeAddress(),
      ...overwrite,
    },
    id,
  )

  return customer
}
