import { beforeEach, describe, expect, it } from 'vitest'

import { RegisterOrgUseCase } from '../register-org-use-case'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error'
import { compare } from 'bcryptjs'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('Use cases: Register Org', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should register an org', async () => {
    const { org } = await sut.execute(fakeOrg)

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash org password upon registration', async () => {
    const { org } = await sut.execute(fakeOrg)

    const isPasswordCorrectlyHashed = await compare('123456', org.password)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with email twice', async () => {
    await sut.execute(fakeOrg)

    expect(sut.execute(fakeOrg)).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})

const fakeOrg = {
  name: 'test',
  email: 'test@example.com',
  password: '123456',
  whatsapp: '+5518999999999',
  cep: '00000000',
  state: 'TS',
  city: 'Test City',
  address: 'Test Address',
  latitude: 0,
  longitude: 0,
}
