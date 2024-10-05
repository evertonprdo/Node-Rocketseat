import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'

import { GetPetUseCase } from '../get-pet-use-case'

export function makeGetPetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const useCase = new GetPetUseCase(petsRepository)

  return useCase
}
