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
  constructor(
    private petsRepository: PetsRepository,
    private adoptReqsRepository: AdoptReqsRepository,
  ) {}

  async execute({
    petId,
    description,
  }: RegisterAdoptReqsUseCaseRequest): Promise<RegisterAdoptReqsUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    const adoptReqsInput = description.map((item) => ({
      pet_id: petId,
      description: item,
    }))

    const adoptReqs = await this.adoptReqsRepository.createMany(adoptReqsInput)
    return { adoptReqs }
  }
}
