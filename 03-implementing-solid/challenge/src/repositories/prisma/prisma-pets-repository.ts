import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import { FindAllParams, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
      include: {
        adoption_requirements: true,
        org: true,
      },
    })

    return pet
  }

  async findAll({
    city,
    age,
    energyLevel,
    independenceLevel,
    size,
  }: FindAllParams) {
    const pets = await prisma.pet.findMany({
      where: {
        age,
        size,
        energy_level: energyLevel,
        independence_level: independenceLevel,
        org: {
          city,
        },
      },
      include: { adoption_requirements: true },
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
}
