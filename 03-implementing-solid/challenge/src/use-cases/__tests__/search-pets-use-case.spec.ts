import { beforeEach, describe, expect, it } from 'vitest'

import { makeRandomOrg } from '@__tests__/factories/make-random-org'
import { makeRandomPet } from '@__tests__/factories/make-random-pet'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryAdoptReqsRepository } from '@/repositories/in-memory/in-memory-adopt-reqs-repository'

import { SearchPetsUseCase } from '../search-pets-use-case'

type FilterParamsForEachFilterProps = {
  param: 'age' | 'size' | 'energy_level' | 'independence_level'
  low: string
  med: string
  high: string
}[]

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

  const filterParamsForEachFilter: FilterParamsForEachFilterProps = [
    { param: 'age', low: 'PUPPY', med: 'ADULT', high: 'SENIOR' },
    { param: 'size', low: 'SMALL', med: 'MEDIUM', high: 'LARGE' },
    { param: 'energy_level', low: 'LOW', med: 'MEDIUM', high: 'HIGH' },
    { param: 'independence_level', low: 'LOW', med: 'MEDIUM', high: 'HIGH' },
  ]

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
            energy_level: 'LOW',
            independence_level: 'LOW',
          }),
        )
      } else {
        await petsRepository.create(
          makeRandomPet({
            org_id: org.id,
            age: 'SENIOR',
            size: 'LARGE',
            energy_level: 'HIGH',
            independence_level: 'HIGH',
          }),
        )
      }

      await petsRepository.create(
        makeRandomPet({
          org_id: org.id,
          age: 'ADULT',
          size: 'MEDIUM',
          energy_level: 'MEDIUM',
          independence_level: 'MEDIUM',
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

  filterParamsForEachFilter.forEach((filter) => {
    it(`should list pets by ${filter.param} filer`, async () => {
      const org = await orgsRepository.create(makeRandomOrg())

      for (let i = 0; i < 30; i++) {
        if (i % 2 === 0) {
          await petsRepository.create(
            makeRandomPet({ org_id: org.id, [filter.param]: filter.low }),
          )
        } else {
          await petsRepository.create(
            makeRandomPet({ org_id: org.id, [filter.param]: filter.high }),
          )
        }
        await petsRepository.create(
          makeRandomPet({ org_id: org.id, [filter.param]: filter.med }),
        )
      }

      const lowParamSearchResponse = await sut.execute({
        city: org.city,
        [filter.param]: filter.low,
      })
      const mediumParamSearchResponse = await sut.execute({
        city: org.city,
        [filter.param]: filter.med,
      })
      const highParamSearchResponse = await sut.execute({
        city: org.city,
        [filter.param]: filter.high,
      })

      expect(lowParamSearchResponse.pets).toHaveLength(15)
      expect(highParamSearchResponse.pets).toHaveLength(15)
      expect(mediumParamSearchResponse.pets).toHaveLength(30)

      const isNotAllLowParam = lowParamSearchResponse.pets.some(
        (pet) => pet[filter.param] !== filter.low,
      )
      expect(isNotAllLowParam).toEqual(false)

      const isNotAllMediumParam = mediumParamSearchResponse.pets.some(
        (pet) => pet[filter.param] !== filter.med,
      )
      expect(isNotAllMediumParam).toEqual(false)

      const isNotAllHighParam = highParamSearchResponse.pets.some(
        (pet) => pet[filter.param] !== filter.high,
      )
      expect(isNotAllHighParam).toEqual(false)
    })
  })
})
