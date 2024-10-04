import { AdoptionRequirement, Prisma } from '@prisma/client'

export interface AdoptReqsRepository {
  findAllByPetId(petId: string): Promise<AdoptionRequirement[]>
  createMany(
    adoptReqsInput: Prisma.AdoptionRequirementCreateManyInput[],
  ): Promise<AdoptionRequirement[]>
}
