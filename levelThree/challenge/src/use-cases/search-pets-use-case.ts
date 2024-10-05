import {
  PetWithAdoptionRequirements,
  PetsRepository,
} from '@/repositories/pets-repository'

interface SearchPetsUseCaseRequest {
  city: string
  age?: 'PUPPY' | 'ADULT' | 'SENIOR'
  size?: 'SMALL' | 'MEDIUM' | 'LARGE'
  energy_level?: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
  independence_level?: 'LOW' | 'MEDIUM' | 'HIGH'
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
