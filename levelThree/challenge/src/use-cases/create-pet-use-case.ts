import { Pet } from '@prisma/client'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetsRepository } from '@/repositories/pets-repository'

interface CreatePetUseCaseRequest {
  name: string
  description: string
  age: number
  size: 'SMALL' | 'MEDIUM' | 'LARGE'

  energy_level: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | null
  environment_need: 'SPACIOUS' | 'COMPACT' | 'BOTH' | null
  independence_level: 'LOW' | 'MEDIUM' | 'HIGH' | null

  org_id: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  private petsRepository: PetsRepository
  private orgsRepository: OrgsRepository

  constructor(petRepository: PetsRepository, orgsRepository: OrgsRepository) {
    this.petsRepository = petRepository
    this.orgsRepository = orgsRepository
  }

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
