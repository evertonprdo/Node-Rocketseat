import { randomUUID } from 'node:crypto'
import { Pet, Prisma } from '@prisma/client'

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { InMemoryAdoptReqsRepository } from './in-memory-adopt-reqs-repository'
import { InMemoryOrgsRepository } from './in-memory-orgs-repository'

import { FindAllParams, PetsRepository } from '../pets-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  constructor(
    private orgsRepository: InMemoryOrgsRepository,
    private adoptReqsRepository: InMemoryAdoptReqsRepository,
  ) {}

  async findAll({
    city,
    age,
    energyLevel,
    independenceLevel,
    size,
  }: FindAllParams) {
    const orgsByCity = await this.orgsRepository.findManyByCity(city)

    const pets = this.items
      .filter((item) => orgsByCity.some((org) => org.id === item.org_id))
      .filter((item) => (age ? item.age === age : true))
      .filter((item) => (size ? item.size === size : true))
      .filter((item) =>
        energyLevel ? item.energy_level === energyLevel : true,
      )
      .filter((item) =>
        independenceLevel
          ? item.independence_level === independenceLevel
          : true,
      )

    const petsWithAdoptReqs = await Promise.all(
      pets.map(async (item) => ({
        ...item,
        adoption_requirements: await this.adoptReqsRepository.findAllByPetId(
          item.id,
        ),
      })),
    )

    return petsWithAdoptReqs
  }

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    const org = await this.orgsRepository.findById(pet.org_id)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const adoptReqs = await this.adoptReqsRepository.findAllByPetId(id)

    return { ...pet, adoption_requirements: adoptReqs, org }
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
