import { it, expect, describe, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Near By Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: 31.7781594,
      longitude: 35.2352054,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: 31.7442593,
      longitude: 34.9447338,
    })

    const { gyms } = await sut.execute({
      userLatitude: 31.7781594,
      userLongitude: 35.2352054,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
