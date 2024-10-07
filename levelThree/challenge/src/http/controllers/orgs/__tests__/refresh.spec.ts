import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '@/app'
import { makeRandomOrg } from '@__tests__/factories/make-random-org'

describe('(e2e): Refresh', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh', async () => {
    await request(app.server)
      .post('/orgs')
      .send(makeRandomOrg({ email: 'org@mail.com', password: '123456' }))

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'org@mail.com',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie') ?? []

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(authResponse.statusCode).toEqual(200)
    expect(authResponse.body).toEqual({
      token: expect.any(String),
    })

    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
