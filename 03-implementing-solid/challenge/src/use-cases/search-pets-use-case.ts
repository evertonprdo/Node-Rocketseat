import {
  PetWithAdoptionRequirements,
  PetsRepository,
} from '@/repositories/pets-repository'
import { Age, EnergyLevel, IndependenceLevel, Size } from '@/utils/enums'

interface SearchPetsUseCaseRequest {
  city: string
  age?: Age
  size?: Size
  energy_level?: EnergyLevel
  independence_level?: IndependenceLevel
}

interface SearchPetsUseCaseResponse {
  pets: PetWithAdoptionRequirements[]
}

export class SearchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(
    params: SearchPetsUseCaseRequest,
  ): Promise<SearchPetsUseCaseResponse> {
    const pets = await this.petsRepository.findAll({
      ...params,
      energyLevel: params.energy_level,
      independenceLevel: params.independence_level,
    })

    return { pets }
  }
}
