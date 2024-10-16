import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Courier, CourierProps } from '@/domain/admin/entities/courier'
import { makeCPF } from './make-cpf'
import { CPF } from '@/domain/admin/entities/value-objects/cpf'

export function makeCourier(
  overwrite?: Partial<CourierProps>,
  id?: UniqueEntityId,
) {
  const courier = Courier.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.createFromText(makeCPF()),
      password: faker.internet.password(),
      ...overwrite,
    },
    id,
  )

  return courier
}
