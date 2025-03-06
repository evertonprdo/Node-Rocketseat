import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { makeRandomOrg } from '@__tests__/factories/make-random-org'
import { app } from '@/app'

describe('(e2e): Create Org', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an org', async () => {
    const response = await request(app.server)
      .post('/orgs')
      .send(makeRandomOrg())

    expect(response.statusCode).toEqual(201)
  })
})
