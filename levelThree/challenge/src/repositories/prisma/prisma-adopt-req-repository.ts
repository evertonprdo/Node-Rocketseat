import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import { AdoptReqsRepository } from '../adopt-req-repository'

export class PrismaAdoptReqsRepository implements AdoptReqsRepository {
  async createMany(
    adoptReqsInput: Prisma.AdoptionRequirementCreateManyInput[],
  ) {
    const adoptionsRequirements =
      await prisma.adoptionRequirement.createManyAndReturn({
        data: adoptReqsInput,
      })

    return adoptionsRequirements
  }
}
