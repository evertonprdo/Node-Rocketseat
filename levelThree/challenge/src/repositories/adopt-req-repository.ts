import { AdoptionRequirement } from '@prisma/client'

export interface AdoptReqsRepository {
  createMany(
    pet_id: string,
    description: string[],
  ): Promise<AdoptionRequirement[]>
}
