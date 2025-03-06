import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Admin, AdminProps } from '../../entities/admin'

export function makeAdmin(
  overwrite: Partial<AdminProps> = {},
  id?: UniqueEntityId,
) {
  const admin = Admin.create(
    {
      userId: new UniqueEntityId(),
      email: faker.internet.email(),
      ...overwrite,
    },
    id,
  )

  return admin
}
