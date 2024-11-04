import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { User, UserProps } from '../../entities/user'

import { CPF } from '@/domain/_shared/entities/value-objects/cpf'
import { makeCPF } from '@/domain/_shared/_tests/factories/make-cpf'

export function makeUser(
  overwrite: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const user = User.create(
    {
      cpf: CPF.createFromText(makeCPF()),
      password: faker.internet.password(),
      ...overwrite,
    },
    id,
  )

  return user
}
