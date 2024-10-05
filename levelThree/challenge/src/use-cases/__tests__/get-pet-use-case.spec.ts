import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

import { makeRandomPet } from '@__tests__/factories/make-random-pet'
import { makeRandomAdoptReqs } from '@__tests__/factories/make-random-adopt-reqs'
import { makeRandomOrg } from '@__tests__/factories/make-random-org'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryAdoptReqsRepository } from '@/repositories/in-memory/in-memory-adopt-reqs-repository'

import { GetPetUseCase } from '../get-pet-use-case'

let orgsRepository: InMemoryOrgsRepository
let adoptReqsRepository: InMemoryAdoptReqsRepository
let petsRepository: InMemoryPetsRepository
let sut: GetPetUseCase

describe('Use Case: Get Pet', () => {
  beforeEach(() => {
    adoptReqsRepository = new InMemoryAdoptReqsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(
      orgsRepository,
      adoptReqsRepository,
    )

    sut = new GetPetUseCase(petsRepository)
  })

  it('should get a pet', async () => {
    const org = await orgsRepository.create(makeRandomOrg())
    const pet = await petsRepository.create(makeRandomPet({ org_id: org.id }))
    const adoptReqs = await adoptReqsRepository.createMany(
      makeRandomAdoptReqs({ pet_id: pet.id }),
    )

    expect(sut.execute({ petId: pet.id })).resolves.toEqual({
      pet: { ...pet, adoption_requirements: adoptReqs, org },
    })
  })

  it('should throw resource not found', async () => {
    expect(sut.execute({ petId: 'unregistered-pet' })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
