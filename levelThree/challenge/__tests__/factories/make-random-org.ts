import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker/locale/en'
import { Org } from '@prisma/client'

type Overwrite = {
  city?: string
  email?: string
  password?: string
  latitude?: number
  longitude?: number
}

type MakeRandomOrgResponse = {
  longitude: number
  latitude: number
} & Omit<Org, 'latitude' | 'longitude'>

export function makeRandomOrg(overwrite?: Overwrite): MakeRandomOrgResponse {
  const fakeAddress = `${faker.location.street()} ${faker.location.streetAddress()}`

  return {
    id: randomUUID(),
    name: faker.person.fullName(),
    email: overwrite?.email ?? faker.internet.email(),
    password: overwrite?.password ?? faker.internet.password(),
    whatsapp: faker.phone.number({ style: 'international' }),
    cep: faker.location.zipCode(),
    state: faker.location.state(),
    city: overwrite?.city ?? faker.location.city(),
    address: fakeAddress,
    latitude: overwrite?.latitude ?? faker.location.latitude(),
    longitude: overwrite?.longitude ?? faker.location.longitude(),
  }
}
