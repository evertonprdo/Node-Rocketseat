import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryAdoptReqsRepository } from '@/repositories/in-memory/in-memory-adopt-reqs-repository'

import { AdoptReqsUseCase } from '../adopt-reqs-use-case'
import { makeRandomPet } from '@__tests__/factories/make-random-pet'

let orgsRepository: InMemoryOrgsRepository
let adoptReqsRepository: InMemoryAdoptReqsRepository
let petsRepository: InMemoryPetsRepository
let sut: AdoptReqsUseCase

describe('Use cases: Adoption Requirements', () => {
  beforeEach(() => {
    adoptReqsRepository = new InMemoryAdoptReqsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(
      orgsRepository,
      adoptReqsRepository,
    )

    sut = new AdoptReqsUseCase(petsRepository, adoptReqsRepository)
  })

  it('should register a adoption requirements', async () => {
    const pet = await petsRepository.create(makeRandomPet())
    const { adoptReqs } = await sut.execute({
      petId: pet.id,
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
        petId: 'unregistered-pet',
        description: [],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
