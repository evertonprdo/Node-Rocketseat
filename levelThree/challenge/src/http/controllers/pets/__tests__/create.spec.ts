import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { createAndAuthenticateOrg } from '@__tests__/utils/create-and-authenticate-org'
import { makeRandomPet } from '@__tests__/factories/make-random-pet'

import { app } from '@/app'

describe('(e2e): Create Pet', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a pet', async () => {
    const { token, org_id: orgId } = await createAndAuthenticateOrg(app)

    const pet = makeRandomPet({ org_id: orgId })
    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...pet,
        adoption_requirements: ['req-1', 'req-2', 'req-3'],
      })

    expect(response.statusCode).toEqual(201)
  })
})
