import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { makeRandomPet } from '@__tests__/factories/make-random-pet'
import { makeRandomOrg } from '@__tests__/factories/make-random-org'

import { prisma } from '@/lib/prisma'
import { app } from '@/app'

describe('(e2e): Search Pets', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to list pets by city', async () => {
    const org = await prisma.org.create({
      data: makeRandomOrg(),
    })

    await prisma.pet.createMany({
      data: [...Array(30)].map(() => makeRandomPet({ org_id: org.id })),
    })

    const response = await request(app.server)
      .get('/pets')
      .query({ city: org.city })

    expect(response.status).toEqual(200)
    expect(response.body.pets).toHaveLength(30)
  })
})
