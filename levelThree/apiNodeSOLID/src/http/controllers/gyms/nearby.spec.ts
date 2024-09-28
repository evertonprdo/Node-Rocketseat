import { afterAll, beforeAll, expect, it, describe } from 'vitest'
import resquest from 'supertest'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { app } from '@/app'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await resquest(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: 31.7781594,
        longitude: 35.2352054,
      })

    await resquest(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: 31.7442593,
        longitude: 34.9447338,
      })

    const response = await resquest(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: 31.7781594,
        longitude: 35.2352054,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
