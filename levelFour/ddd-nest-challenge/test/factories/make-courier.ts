import { faker } from '@faker-js/faker'
import { makeCPF } from './make-cpf'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CPF } from '@/domain/delivery/entities/value-objects/cpf'
import { Courier, CourierProps } from '@/domain/delivery/entities/courier'

export function makeCourier(
  overwrite: Partial<CourierProps> = {},
  id?: UniqueEntityId,
) {
  const courier = Courier.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.createFromText(makeCPF()),
      password: faker.internet.password(),
      operationCity: faker.location.city(),
      ...overwrite,
    },
    id,
  )

  return courier
}
