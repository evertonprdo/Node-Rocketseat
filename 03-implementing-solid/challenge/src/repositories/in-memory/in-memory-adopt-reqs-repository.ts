import { AdoptionRequirement, Prisma } from '@prisma/client'

import { AdoptReqsRepository } from '../adopt-req-repository'

export class InMemoryAdoptReqsRepository implements AdoptReqsRepository {
  public items: AdoptionRequirement[] = []
  public autoIncrement: number = 1

  async findAllByPetId(petId: string) {
    const adoptReqs = this.items.filter((item) => item.pet_id === petId)

    return adoptReqs
  }

  async createMany(
    adoptReqsInput: Prisma.AdoptionRequirementCreateManyInput[],
  ) {
    const adoptReqs = adoptReqsInput.map((item) => ({
      id: this.autoIncrement++,
      pet_id: item.pet_id,
      description: item.description,
    }))

    this.items.push(...adoptReqs)

    return adoptReqs
  }
}
