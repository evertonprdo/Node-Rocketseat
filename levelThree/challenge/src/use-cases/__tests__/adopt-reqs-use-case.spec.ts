import { Pet } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryAdoptReqsRepository } from '@/repositories/in-memory/in-memory-adopt-reqs-repository'

import { AdoptReqsUseCase } from '../adopt-reqs-use-case'

let adoptReqsRepository: InMemoryAdoptReqsRepository
let petsRepository: InMemoryPetsRepository
let sut: AdoptReqsUseCase

describe('Use cases: Adoption Requirements', () => {
  beforeEach(() => {
    adoptReqsRepository = new InMemoryAdoptReqsRepository()
    petsRepository = new InMemoryPetsRepository()
    sut = new AdoptReqsUseCase(petsRepository, adoptReqsRepository)
  })

  it('should register a adoption requirements', async () => {
    petsRepository.items.push(fakePet)
    const { adoptReqs } = await sut.execute({
      petId: 'test-pet-id',
      description: [
        'adoption-requirement-1',
        'adoption-requirement-2',
        'adoption-requirement-3',
      ],
    })

    expect(adoptReqs).toHaveLength(3)
    expect(adoptReqs[0]).toEqual(expect.objectContaining({ id: 1 }))
  })

  it('should throw not found error', async () => {
    expect(
      sut.execute({
        petId: 'test-pet-id',
        description: [],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

const fakePet: Pet = {
  id: 'test-pet-id',
  name: 'Test',
  description: 'Test Description',
  age: 3,
  size: 'SMALL',

  energy_level: null,
  environment_need: null,
  independence_level: null,

  org_id: 'test-org-id',
}
