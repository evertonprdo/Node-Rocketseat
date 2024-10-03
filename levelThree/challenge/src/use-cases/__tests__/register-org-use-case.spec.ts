import { beforeEach, describe, expect, it } from 'vitest'

import { RegisterOrgUseCase } from '../register-org-use-case'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('Use cases: Register Org', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should register an org', async () => {
    const { org } = await sut.execute({
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
    })

    expect(org.id).toEqual(expect.any(String))
  })
})
