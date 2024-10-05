import { randomUUID } from 'node:crypto'

import { Age, EnergyLevel, IndependenceLevel, Pet, Size } from '@prisma/client'
import { faker } from '@faker-js/faker/locale/en'

type Overwrite = {
  org_id?: string
  age?: Age
  size?: Size
  energyLevel?: EnergyLevel
  independenceLevel?: IndependenceLevel
}

export function makeRandomPet(overwrite?: Overwrite): Pet {
  return {
    id: randomUUID(),
    org_id: overwrite?.org_id ?? randomUUID(),
    name: faker.animal.cat(),
    description: faker.lorem.paragraph(),
    age:
      overwrite?.age ??
      faker.helpers.arrayElement(['PUPPY', 'ADULT', 'SENIOR']),
    size:
      overwrite?.size ??
      faker.helpers.arrayElement(['SMALL', 'MEDIUM', 'LARGE']),
    energy_level:
      overwrite?.energyLevel ??
      faker.helpers.arrayElement([
        'VERY_LOW',
        'LOW',
        'MEDIUM',
        'HIGH',
        'VERY_HIGH',
      ]),
    environment_need: faker.helpers.arrayElement([
      'SPACIOUS',
      'COMPACT',
      'BOTH',
    ]),
    independence_level:
      overwrite?.independenceLevel ??
      faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH']),
  }
}
