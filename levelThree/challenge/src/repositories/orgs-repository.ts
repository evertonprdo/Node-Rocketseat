import { Org, Prisma } from '@prisma/client'

export interface findManyNearbyParams {
  latitude: number
  longitude: number
}

export interface OrgsRepository {
  findManyNearby(params: findManyNearbyParams): Promise<Org[]>
  findManyByCity(city: string): Promise<Org[]>
  findById(id: string): Promise<Org | null>
  findByEmail(email: string): Promise<Org | null>
  create(data: Prisma.OrgCreateInput): Promise<Org>
}
