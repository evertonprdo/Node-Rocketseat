import { Pet, Prisma } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

import { CreatePetUseCase } from '../create-pet-use-case'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase

describe('Use cases: Create Pet', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository()
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should register a pet', async () => {
    orgsRepository.items.push(fakeGym)

    const { pet } = await sut.execute(fakePet)

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should throw not found error', async () => {
    expect(sut.execute(fakePet)).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

const fakeGym = {
  id: 'test-org-id',
  name: 'Test',
  email: 'test@example.com',
  password: '123456',
  whatsapp: '+5533...',
  state: 'TS',
  city: 'Test City',
  address: 'Test Street',
  cep: '1234565123',
  latitude: new Prisma.Decimal(0),
  longitude: new Prisma.Decimal(0),
}

const fakePet: Omit<Pet, 'id'> = {
  name: 'Test',
  description: 'Test Description',
  age: 3,
  size: 'SMALL',

  energy_level: null,
  environment_need: null,
  independence_level: null,
  org_id: 'test-org-id',
}
