import { faker } from '@faker-js/faker'

import { CEP } from '@/domain/_shared/entities/value-objects/cep'
import { makeCEP } from '@/domain/_shared/_tests/factories/make-cep'

import {
  Address,
  AddressProps,
} from '@/domain/_shared/entities/value-objects/address'

export function makeAddress(overwrite: Partial<AddressProps> = {}) {
  const address = new Address({
    cep: CEP.createFromText(makeCEP()),
    city: faker.location.city(),
    neighborhood: faker.location.streetAddress(),
    state: faker.location.state(),
    number: faker.location.buildingNumber(),
    street: faker.location.street(),

    ...overwrite,
  })

  return address
}
