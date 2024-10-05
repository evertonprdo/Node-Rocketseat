import {
  AdoptionRequirement,
  IndependenceLevel,
  EnergyLevel,
  Prisma,
  Size,
  Age,
  Org,
  Pet,
} from '@prisma/client'

export interface FindAllParams {
  city: string
  age?: Age
  size?: Size
  energyLevel?: EnergyLevel
  independenceLevel?: IndependenceLevel
}

export interface PetWithAdoptionRequirements extends Pet {
  adoption_requirements: AdoptionRequirement[]
}

export interface PetWithAllRelations extends PetWithAdoptionRequirements {
  org: Org
}

export interface PetsRepository {
  findById(id: string): Promise<PetWithAllRelations | null>
  findAll(params: FindAllParams): Promise<PetWithAdoptionRequirements[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
