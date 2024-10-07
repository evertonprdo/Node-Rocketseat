import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { makeRandomAdoptReqs } from '@__tests__/factories/make-random-adopt-reqs'
import { makeRandomPet } from '@__tests__/factories/make-random-pet'

import { prisma } from '@/lib/prisma'
import { app } from '@/app'
import { makeRandomOrg } from '@__tests__/factories/make-random-org'

describe('(e2e): Get Pet Details', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a pet details', async () => {
    const org = await prisma.org.create({
      data: makeRandomOrg(),
    })
    const pet = await prisma.pet.create({
      data: makeRandomPet({ org_id: org.id }),
    })
    const adoptReqs = await prisma.adoptionRequirement.createManyAndReturn({
      data: makeRandomAdoptReqs({ pet_id: pet.id }),
    })

    const response = await request(app.server).get(`/pets/${pet.id}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      pet: expect.objectContaining({
        ...pet,
        adoption_requirements: [...adoptReqs],
      }),
    })
  })
})
