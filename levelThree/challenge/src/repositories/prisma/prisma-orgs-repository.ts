import { Org, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import { findManyNearbyParams, OrgsRepository } from '../orgs-repository'

export class PrismaOrgsRepository implements OrgsRepository {
  async findManyNearby({ latitude, longitude }: findManyNearbyParams) {
    const orgs = await prisma.$queryRaw<Org[]>`
    SELECT * from gyms
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
  `

    return orgs
  }

  async findManyByCity(city: string) {
    const orgs = await prisma.org.findMany({
      where: {
        city,
      },
    })

    return orgs
  }

  async findById(id: string) {
    const org = await prisma.org.findUnique({
      where: { id },
    })

    return org
  }

  async findByEmail(email: string) {
    const org = await prisma.org.findUnique({
      where: { email },
    })

    return org
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = await prisma.org.create({
      data,
    })

    return org
  }
}
