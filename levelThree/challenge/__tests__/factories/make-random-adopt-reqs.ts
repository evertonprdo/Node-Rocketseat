import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker/locale/en'
import { AdoptionRequirement } from '@prisma/client'

type Overwrite = {
  pet_id?: string
}

export function makeRandomAdoptReqs(
  overwrite?: Overwrite,
): AdoptionRequirement[] {
  return faker.helpers.multiple(() => ({
    id: faker.number.int(),
    description: faker.lorem.lines(),
    pet_id: overwrite?.pet_id ?? randomUUID(),
  }))
}
