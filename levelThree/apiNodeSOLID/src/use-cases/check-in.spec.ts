import { it, expect, describe, beforeEach, vi, afterEach } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: 31.7781594,
      longitude: 35.2352054,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 31.7781594,
      userLongitude: 35.2352054,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 31.7781594,
      userLongitude: 35.2352054,
    })

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 31.7781594,
        userLongitude: 35.2352054,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 31.7781594,
      userLongitude: 35.2352054,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 31.7781594,
        userLongitude: 35.2352054,
      }),
    ).resolves.toBeTruthy()
  })

  it('should be not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      latitude: new Decimal(31.7763468),
      longitude: new Decimal(35.2283546),
      phone: '',
    })

    await expect(
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: 31.7781594,
        userLongitude: 35.2352054,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
