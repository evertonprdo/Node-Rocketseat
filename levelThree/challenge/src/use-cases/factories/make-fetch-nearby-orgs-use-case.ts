import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'

import { FetchNearbyOrgsUseCase } from '../fetch-nearby-orgs-use-case'

export function makeFetchNearbyOrgsUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const useCase = new FetchNearbyOrgsUseCase(orgsRepository)

  return useCase
}
