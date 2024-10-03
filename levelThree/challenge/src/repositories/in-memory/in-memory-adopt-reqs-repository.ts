import { AdoptionRequirement } from '@prisma/client'

import { AdoptReqsRepository } from '../adopt-req-repository'

export class InMemoryAdoptReqsRepository implements AdoptReqsRepository {
  public items: AdoptionRequirement[] = []
  public autoIncrement: number = 1

  async createMany(petId: string, description: string[]) {
    const adoptReqs = description.map((item) => ({
      id: this.autoIncrement++,
      description: item,
      pet_id: petId,
    }))

    this.items.push(...adoptReqs)

    return adoptReqs
  }
}
