import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { OrgAlreadyExistsError } from '../errors/org-already-exists-error'
import { makeRandomOrg } from '@__tests__/factories/make-random-org'

import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

import { CreateOrgUseCase } from '../create-org-use-case'

let orgsRepository: InMemoryOrgsRepository
let sut: CreateOrgUseCase

describe('Use cases: Create Org', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreateOrgUseCase(orgsRepository)
  })

  it('should create an org', async () => {
    const { org } = await sut.execute(makeRandomOrg())

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash org password upon registration', async () => {
    const { org } = await sut.execute(makeRandomOrg({ password: '123456' }))

    const isPasswordCorrectlyHashed = await compare('123456', org.password)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with email twice', async () => {
    await sut.execute(makeRandomOrg({ email: 'test@example.com' }))

    expect(
      sut.execute(makeRandomOrg({ email: 'test@example.com' })),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
