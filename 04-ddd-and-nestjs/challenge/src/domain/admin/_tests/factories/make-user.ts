import { faker } from '@faker-js/faker'
import { makeCPF } from '@/domain/_shared/_tests/factories/make-cpf'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CPF } from '@/domain/_shared/entities/value-objects/cpf'

import { User, UserProps } from '../../entities/user'

export function makeUser(
  overwrite: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.createFromText(makeCPF()),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      ...overwrite,
    },
    id,
  )

  return user
}
