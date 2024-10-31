import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Customer, CustomerProps } from '@/domain/delivery/entities/customer'
import { CEP } from '@/domain/_shared/entities/value-objects/cep'
import { makeCEP } from './make-cep'

export function makeCustomer(
  overwrite: Partial<CustomerProps> = {},
  id?: UniqueEntityId,
) {
  const customer = Customer.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: {
        cep: CEP.createFromText(makeCEP()),
        city: faker.location.city(),
        neighborhood: faker.location.streetAddress(),
        state: faker.location.state(),
        number: faker.location.buildingNumber(),
        street: faker.location.street(),
      },
      ...overwrite,
    },
    id,
  )

  return customer
}
