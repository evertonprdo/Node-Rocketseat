import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

import { makeRandomPet } from '@__tests__/factories/make-random-pet'
import { makeRandomOrg } from '@__tests__/factories/make-random-org'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryAdoptReqsRepository } from '@/repositories/in-memory/in-memory-adopt-reqs-repository'

import { CreatePetUseCase } from '../create-pet-use-case'

let adoptReqsRepository: InMemoryAdoptReqsRepository
let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase

describe('Use cases: Create Pet', () => {
  beforeEach(() => {
    adoptReqsRepository = new InMemoryAdoptReqsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(
      orgsRepository,
      adoptReqsRepository,
    )

    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should register a pet', async () => {
    const org = await orgsRepository.create(makeRandomOrg())

    const { pet } = await sut.execute(makeRandomPet({ org_id: org.id }))

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should throw not found error', async () => {
    expect(sut.execute(makeRandomPet())).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
