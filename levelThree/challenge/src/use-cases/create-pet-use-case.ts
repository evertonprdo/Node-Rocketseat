import { Pet } from '@prisma/client'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetsRepository } from '@/repositories/pets-repository'

interface CreatePetUseCaseRequest {
  name: string
  description: string
  age: 'PUPPY' | 'ADULT' | 'SENIOR'
  size: 'SMALL' | 'MEDIUM' | 'LARGE'

  energy_level: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
  environment_need: 'SPACIOUS' | 'COMPACT' | 'BOTH'
  independence_level: 'LOW' | 'MEDIUM' | 'HIGH'

  org_id: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute(
    data: CreatePetUseCaseRequest,
  ): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.findById(data.org_id)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.create(data)

    return { pet }
  }
}
