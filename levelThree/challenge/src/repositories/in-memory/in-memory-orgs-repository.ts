import { randomUUID } from 'node:crypto'
import { Org, Prisma } from '@prisma/client'

import { OrgsRepository } from '../orgs-repository'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findById(id: string) {
    const org = this.items.find((item) => item.id === id)

    if (!org) {
      return null
    }

    return org
  }

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)

    if (!org) {
      return null
    }

    return org
  }

  async findManyByCity(city: string) {
    const orgs = this.items.filter((item) => item.city === city)

    return orgs
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      ...data,
      id: randomUUID(),
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(org)

    return org
  }
}
