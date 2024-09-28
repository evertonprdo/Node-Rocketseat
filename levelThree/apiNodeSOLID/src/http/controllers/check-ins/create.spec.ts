import { afterAll, beforeAll, expect, it, describe } from 'vitest'
import resquest from 'supertest'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: 31.7781594,
        longitude: 35.2352054,
      },
    })

    const response = await resquest(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: 31.7781594,
        longitude: 35.2352054,
      })

    expect(response.statusCode).toEqual(201)
  })
})
