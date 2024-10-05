import { AdoptionRequirement, Prisma } from '@prisma/client'

export interface AdoptReqsRepository {
  createMany(
    adoptReqsInput: Prisma.AdoptionRequirementCreateManyInput[],
  ): Promise<AdoptionRequirement[]>
}
