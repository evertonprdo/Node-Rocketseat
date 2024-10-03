import { randomUUID } from 'node:crypto'
import { Pet, Prisma } from '@prisma/client'

import { PetsRepository } from '../pets-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async findById(id: string) {
    const org = this.items.find((item) => item.id === id)

    if (!org) {
      return null
    }

    return org
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      ...data,
      id: randomUUID(),
      energy_level: data.energy_level ?? null,
      environment_need: data.environment_need ?? null,
      independence_level: data.independence_level ?? null,
    }

    this.items.push(pet)

    return pet
  }
}
