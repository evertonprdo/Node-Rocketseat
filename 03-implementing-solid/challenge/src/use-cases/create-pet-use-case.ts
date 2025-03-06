import { Pet } from '@prisma/client'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import {
  Age,
  EnergyLevel,
  EnvironmentNeed,
  IndependenceLevel,
  Size,
} from '@/utils/enums'

import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetsRepository } from '@/repositories/pets-repository'

interface CreatePetUseCaseRequest {
  name: string
  description: string
  age: Age
  size: Size
  energy_level: EnergyLevel
  environment_need: EnvironmentNeed
  independence_level: IndependenceLevel
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
