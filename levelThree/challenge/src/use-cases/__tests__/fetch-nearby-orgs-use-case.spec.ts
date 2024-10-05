import { beforeEach, describe, expect, it } from 'vitest'

import { makeRandomOrg } from '@__tests__/factories/make-random-org'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

import { FetchNearbyOrgsUseCase } from '../fetch-nearby-orgs-use-case'

let orgsRepository: InMemoryOrgsRepository
let sut: FetchNearbyOrgsUseCase

describe('Use Cases: Fetch Nearby Orgs', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new FetchNearbyOrgsUseCase(orgsRepository)
  })

  const nearbyOrg = { latitude: 31.7442593, longitude: 34.9447338 }
  const farawayOrg = { latitude: 31.7781594, longitude: 35.2352054 }

  it('should list all orgs nearby 10 kilometers', async () => {
    const org = await orgsRepository.create(makeRandomOrg(nearbyOrg))
    await orgsRepository.create(makeRandomOrg(farawayOrg))

    const { orgs } = await sut.execute({
      latitude: org.latitude.toNumber(),
      longitude: org.longitude.toNumber(),
    })

    expect(orgs).toHaveLength(1)
    expect(orgs).toEqual([org])
  })

  it('should not list an organization more than 10 kilometers away', async () => {
    await orgsRepository.create(makeRandomOrg(farawayOrg))

    const { orgs } = await sut.execute(nearbyOrg)

    expect(orgs).toHaveLength(0)
  })
})
