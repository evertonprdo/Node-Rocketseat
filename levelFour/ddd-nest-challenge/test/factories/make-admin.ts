import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/delivery/entities/admin'
import { makeCPF } from './make-cpf'
import { CPF } from '@/domain/_shared/entities/value-objects/cpf'

export function makeAdmin(
  overwrite: Partial<AdminProps> = {},
  id?: UniqueEntityId,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.createFromText(makeCPF()),
      password: faker.internet.password(),
      ...overwrite,
    },
    id,
  )

  return admin
}
