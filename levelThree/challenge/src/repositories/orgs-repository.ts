import { Org, Prisma } from '@prisma/client'

export interface OrgsRepository {
  findManyByCity(city: string): Promise<Org[]>
  findById(id: string): Promise<Org | null>
  findByEmail(email: string): Promise<Org | null>
  create(data: Prisma.OrgCreateInput): Promise<Org>
}
