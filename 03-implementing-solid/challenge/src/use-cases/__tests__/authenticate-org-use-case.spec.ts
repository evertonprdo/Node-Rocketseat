import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'

import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { makeRandomOrg } from '@__tests__/factories/make-random-org'

import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

import { AuthenticateOrgUseCase } from '../authenticate-org-use-case'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateOrgUseCase

describe('Use Cases: Authenticate org', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateOrgUseCase(orgsRepository)
  })

  it('should be able to authenticate an org', async () => {
    const org = await orgsRepository.create(
      makeRandomOrg({ password: await hash('123456', 6) }),
    )

    expect(
      sut.execute({ email: org.email, password: '123456' }),
    ).resolves.toBeTruthy()
  })

  it('should not be possible to authenticate an org with invalid credentials', async () => {
    expect(
      sut.execute({
        email: 'non-existent-email',
        password: 'any-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate an org with wrong password', async () => {
    const org = await orgsRepository.create(makeRandomOrg())

    expect(
      sut.execute({ email: org.email, password: 'not-the-correct-password' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
