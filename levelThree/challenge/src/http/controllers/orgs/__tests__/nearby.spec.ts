import { afterAll, beforeAll, expect, it, describe } from 'vitest'
import request from 'supertest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { makeRandomOrg } from '@__tests__/factories/make-random-org'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    await prisma.org.create({
      data: makeRandomOrg({ latitude: 0, longitude: 0 }),
    })
    await prisma.org.createMany({
      data: [...Array(3)].map(() =>
        makeRandomOrg({ latitude: 31.7781594, longitude: 35.2352054 }),
      ),
    })

    const response = await request(app.server).get('/orgs/nearby').query({
      latitude: 31.7781594,
      longitude: 35.2352054,
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.orgs).toHaveLength(3)
  })
})
