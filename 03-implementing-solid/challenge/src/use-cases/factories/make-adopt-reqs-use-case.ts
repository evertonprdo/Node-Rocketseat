import { PrismaAdoptReqsRepository } from '@/repositories/prisma/prisma-adopt-req-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'

import { AdoptReqsUseCase } from '../adopt-reqs-use-case'

export function makeAdoptReqsUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const adoptReqsRepository = new PrismaAdoptReqsRepository()

  const useCase = new AdoptReqsUseCase(petsRepository, adoptReqsRepository)

  return useCase
}
