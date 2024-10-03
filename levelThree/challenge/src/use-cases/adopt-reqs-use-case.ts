import type { AdoptionRequirement } from '@prisma/client'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

import { PetsRepository } from '@/repositories/pets-repository'
import { AdoptReqsRepository } from '@/repositories/adopt-req-repository'

interface RegisterAdoptReqsUseCaseRequest {
  petId: string
  description: string[]
}

interface RegisterAdoptReqsUseCaseResponse {
  adoptReqs: AdoptionRequirement[]
}

export class AdoptReqsUseCase {
  private petRepository: PetsRepository
  private adoptReqsRepository: AdoptReqsRepository

  constructor(
    petRepository: PetsRepository,
    adoptionRequirementsRepository: AdoptReqsRepository,
  ) {
    this.petRepository = petRepository
    this.adoptReqsRepository = adoptionRequirementsRepository
  }

  async execute({
    petId,
    description,
  }: RegisterAdoptReqsUseCaseRequest): Promise<RegisterAdoptReqsUseCaseResponse> {
    const pet = await this.petRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    const reqs = await this.adoptReqsRepository.createMany(petId, description)
    return { adoptReqs: reqs }
  }
}
