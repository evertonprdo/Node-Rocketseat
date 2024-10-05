import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryAdoptReqsRepository } from '@/repositories/in-memory/in-memory-adopt-reqs-repository'

import { SearchPetsUseCase } from '../search-pets-use-case'
import { makeRandomOrg } from '@__tests__/factories/make-random-org'
import { makeRandomPet } from '@__tests__/factories/make-random-pet'

let adoptRepository: InMemoryAdoptReqsRepository
let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: SearchPetsUseCase

describe('Use Cases: Search Pets', () => {
  beforeEach(() => {
    adoptRepository = new InMemoryAdoptReqsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository, adoptRepository)

    sut = new SearchPetsUseCase(petsRepository)
  })

  it('should list all pets available for adoption in a city', async () => {
    const anOrgInNotThatOneCity = await orgsRepository.create(
      makeRandomOrg({ city: 'Not That One City' }),
    )
    const anOrgInThatOneCity = await orgsRepository.create(
      makeRandomOrg({ city: 'That One City' }),
    )
    const otherOrgInThatOneCity = await orgsRepository.create(
      makeRandomOrg({ city: 'That One City' }),
    )

    for (let i = 0; i < 30; i++) {
      if (i % 2 === 0) {
        await petsRepository.create(
          makeRandomPet({ org_id: anOrgInNotThatOneCity.id }),
        )
      } else {
        await petsRepository.create(
          makeRandomPet({ org_id: anOrgInThatOneCity.id }),
        )
      }
      await petsRepository.create(
        makeRandomPet({ org_id: otherOrgInThatOneCity.id }),
      )
    }

    const response = await sut.execute({ city: 'That One City' })
    expect(response.pets).toHaveLength(45)

    const hasAPetInAnOrgInNotThatOneCity = response.pets.some(
      (pet) => pet.org_id === anOrgInNotThatOneCity.id,
    )
    expect(hasAPetInAnOrgInNotThatOneCity).toEqual(false)
  })

  it('should be able to filter pets by age, energy level, size and independence level', async () => {
    const org = await orgsRepository.create(makeRandomOrg())

    for (let i = 0; i < 30; i++) {
      if (i % 2 === 0) {
        await petsRepository.create(
          makeRandomPet({
            org_id: org.id,
            age: 'PUPPY',
            size: 'SMALL',
            energyLevel: 'LOW',
            independenceLevel: 'LOW',
          }),
        )
      } else {
        await petsRepository.create(
          makeRandomPet({
            org_id: org.id,
            age: 'SENIOR',
            size: 'LARGE',
            energyLevel: 'HIGH',
            independenceLevel: 'HIGH',
          }),
        )
      }

      await petsRepository.create(
        makeRandomPet({
          org_id: org.id,
          age: 'ADULT',
          size: 'MEDIUM',
          energyLevel: 'MEDIUM',
          independenceLevel: 'MEDIUM',
        }),
      )
    }

    const lowestParamsSearchResponse = await sut.execute({
      city: org.city,
      age: 'PUPPY',
      size: 'SMALL',
      energy_level: 'LOW',
      independence_level: 'LOW',
    })
    const averageParamsSearchResponse = await sut.execute({
      city: org.city,
      age: 'ADULT',
      size: 'MEDIUM',
      energy_level: 'MEDIUM',
      independence_level: 'MEDIUM',
    })
    const highestParamsSearchResponse = await sut.execute({
      city: org.city,
      age: 'SENIOR',
      size: 'LARGE',
      energy_level: 'HIGH',
      independence_level: 'HIGH',
    })

    expect(lowestParamsSearchResponse.pets).toHaveLength(15)
    expect(highestParamsSearchResponse.pets).toHaveLength(15)
    expect(averageParamsSearchResponse.pets).toHaveLength(30)

    const isNotAllLowestParams = lowestParamsSearchResponse.pets.some(
      (pet) =>
        pet.age !== 'PUPPY' ||
        pet.size !== 'SMALL' ||
        pet.energy_level !== 'LOW' ||
        pet.independence_level !== 'LOW',
    )
    expect(isNotAllLowestParams).toEqual(false)

    const isNotAllAverageParams = averageParamsSearchResponse.pets.some(
      (pet) =>
        pet.age !== 'ADULT' ||
        pet.size !== 'MEDIUM' ||
        pet.energy_level !== 'MEDIUM' ||
        pet.independence_level !== 'MEDIUM',
    )
    expect(isNotAllAverageParams).toEqual(false)

    const isNotAllHighestParams = highestParamsSearchResponse.pets.some(
      (pet) =>
        pet.age !== 'SENIOR' ||
        pet.size !== 'LARGE' ||
        pet.energy_level !== 'HIGH' ||
        pet.independence_level !== 'HIGH',
    )
    expect(isNotAllHighestParams).toEqual(false)
  })

  it('should list pets by age filter', async () => {
    const org = await orgsRepository.create(makeRandomOrg())

    for (let i = 0; i < 30; i++) {
      if (i % 2 === 0) {
        await petsRepository.create(
          makeRandomPet({ org_id: org.id, age: 'PUPPY' }),
        )
      } else {
        await petsRepository.create(
          makeRandomPet({ org_id: org.id, age: 'ADULT' }),
        )
      }
      await petsRepository.create(
        makeRandomPet({ org_id: org.id, age: 'SENIOR' }),
      )
    }

    const puppySearch = await sut.execute({ city: org.city, age: 'PUPPY' })
    const adultSearch = await sut.execute({ city: org.city, age: 'ADULT' })
    const seniorSearch = await sut.execute({ city: org.city, age: 'SENIOR' })

    expect(puppySearch.pets).toHaveLength(15)
    expect(adultSearch.pets).toHaveLength(15)
    expect(seniorSearch.pets).toHaveLength(30)

    const hasAnImpostorAmongPuppies = puppySearch.pets.some(
      (pet) => pet.age !== 'PUPPY',
    )
    expect(hasAnImpostorAmongPuppies).toEqual(false)

    const hasAnImpostorAmongAdults = adultSearch.pets.some(
      (pet) => pet.age !== 'ADULT',
    )
    expect(hasAnImpostorAmongAdults).toEqual(false)

    const hasAnImpostorAmongSeniors = seniorSearch.pets.some(
      (pet) => pet.age !== 'SENIOR',
    )
    expect(hasAnImpostorAmongSeniors).toEqual(false)
  })

  it('should list pets by size filter', async () => {
    const org = await orgsRepository.create(makeRandomOrg())

    for (let i = 0; i < 30; i++) {
      if (i % 2 === 0) {
        await petsRepository.create(
          makeRandomPet({ org_id: org.id, size: 'SMALL' }),
        )
      } else {
        await petsRepository.create(
          makeRandomPet({ org_id: org.id, size: 'MEDIUM' }),
        )
      }
      await petsRepository.create(
        makeRandomPet({ org_id: org.id, size: 'LARGE' }),
      )
    }

    const smallPetSearch = await sut.execute({ city: org.city, size: 'SMALL' })
    const mediumPetSearch = await sut.execute({
      city: org.city,
      size: 'MEDIUM',
    })
    const largeSearch = await sut.execute({ city: org.city, size: 'LARGE' })

    expect(smallPetSearch.pets).toHaveLength(15)
    expect(mediumPetSearch.pets).toHaveLength(15)
    expect(largeSearch.pets).toHaveLength(30)

    const isNotAllSmall = smallPetSearch.pets.some(
      (pet) => pet.size !== 'SMALL',
    )
    expect(isNotAllSmall).toEqual(false)

    const isNotAllMedium = mediumPetSearch.pets.some(
      (pet) => pet.size !== 'MEDIUM',
    )
    expect(isNotAllMedium).toEqual(false)

    const isNotAllLarge = largeSearch.pets.some((pet) => pet.size !== 'LARGE')
    expect(isNotAllLarge).toEqual(false)
  })

  it('should list pets by energy level filter', async () => {
    const org = await orgsRepository.create(makeRandomOrg())

    for (let i = 0; i < 30; i++) {
      if (i % 2) {
        await petsRepository.create(
          makeRandomPet({ org_id: org.id, energyLevel: 'LOW' }),
        )
      } else {
        await petsRepository.create(
          makeRandomPet({ org_id: org.id, energyLevel: 'MEDIUM' }),
        )
      }
      await petsRepository.create(
        makeRandomPet({ org_id: org.id, energyLevel: 'HIGH' }),
      )
    }

    const lowEnergySearch = await sut.execute({
      city: org.city,
      energy_level: 'LOW',
    })
    const mediumEnergySearch = await sut.execute({
      city: org.city,
      energy_level: 'MEDIUM',
    })
    const highEnergySearch = await sut.execute({
      city: org.city,
      energy_level: 'HIGH',
    })

    expect(lowEnergySearch.pets).toHaveLength(15)
    expect(mediumEnergySearch.pets).toHaveLength(15)
    expect(highEnergySearch.pets).toHaveLength(30)

    const isNotAllLowEnergy = lowEnergySearch.pets.some(
      (pet) => pet.energy_level !== 'LOW',
    )
    expect(isNotAllLowEnergy).toEqual(false)

    const isNotAllMediumEnergy = mediumEnergySearch.pets.some(
      (pet) => pet.energy_level !== 'MEDIUM',
    )
    expect(isNotAllMediumEnergy).toEqual(false)

    const isNotAllHighEnergy = highEnergySearch.pets.some(
      (pet) => pet.energy_level !== 'HIGH',
    )
    expect(isNotAllHighEnergy).toEqual(false)
  })

  it('should list pets by independence level filter', async () => {
    const org = await orgsRepository.create(makeRandomOrg())

    for (let i = 0; i < 30; i++) {
      if (i % 2 === 0) {
        await petsRepository.create(
          makeRandomPet({ org_id: org.id, independenceLevel: 'LOW' }),
        )
      } else {
        await petsRepository.create(
          makeRandomPet({ org_id: org.id, independenceLevel: 'MEDIUM' }),
        )
      }
      await petsRepository.create(
        makeRandomPet({ org_id: org.id, independenceLevel: 'HIGH' }),
      )
    }

    const lowIndependenceSearch = await sut.execute({
      city: org.city,
      independence_level: 'LOW',
    })
    const mediumIndependenceSearch = await sut.execute({
      city: org.city,
      independence_level: 'MEDIUM',
    })
    const highIndependenceSearch = await sut.execute({
      city: org.city,
      independence_level: 'HIGH',
    })

    expect(lowIndependenceSearch.pets).toHaveLength(15)
    expect(mediumIndependenceSearch.pets).toHaveLength(15)
    expect(highIndependenceSearch.pets).toHaveLength(30)

    const isNotAllLowIndependence = lowIndependenceSearch.pets.some(
      (pet) => pet.independence_level !== 'LOW',
    )
    expect(isNotAllLowIndependence).toEqual(false)

    const isNotAllMediumIndependence = mediumIndependenceSearch.pets.some(
      (pet) => pet.independence_level !== 'MEDIUM',
    )
    expect(isNotAllMediumIndependence).toEqual(false)

    const isNotAllHighIndependence = highIndependenceSearch.pets.some(
      (pet) => pet.independence_level !== 'HIGH',
    )
    expect(isNotAllHighIndependence).toEqual(false)
  })
})
