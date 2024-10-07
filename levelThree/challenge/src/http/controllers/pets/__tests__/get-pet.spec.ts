import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { createAndAuthenticateOrg } from '@__tests__/utils/create-and-authenticate-org'
import { makeRandomAdoptReqs } from '@__tests__/factories/make-random-adopt-reqs'
import { makeRandomPet } from '@__tests__/factories/make-random-pet'

import { prisma } from '@/lib/prisma'
import { app } from '@/app'

describe('(e2e): Get Pet Details', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a pet details', async () => {
    const { token, org_id: orgId } = await createAndAuthenticateOrg(app)

    const pet = makeRandomPet({ org_id: orgId })
    const adoptReqs = makeRandomAdoptReqs({ pet_id: pet.id })

    await prisma.pet.create({ data: pet })
    await prisma.adoptionRequirement.createMany({ data: adoptReqs })

    const response = await request(app.server)
      .get(`/pets/${pet.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      pet: expect.objectContaining({
        ...pet,
        adoption_requirements: [...adoptReqs],
      }),
    })
  })
})
