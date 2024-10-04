import {
  AdoptionRequirement,
  Age,
  EnergyLevel,
  IndependenceLevel,
  Pet,
  Prisma,
  Size,
} from '@prisma/client'

export interface FindAllParams {
  city: string
  age?: Age
  energyLevel?: EnergyLevel
  size?: Size
  independenceLevel?: IndependenceLevel
}

export interface PetWithAdoptionRequirements extends Pet {
  adoption_requirements: AdoptionRequirement[]
}

export interface PetsRepository {
  findById(id: string): Promise<PetWithAdoptionRequirements | null>
  findAll(params: FindAllParams): Promise<PetWithAdoptionRequirements[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
