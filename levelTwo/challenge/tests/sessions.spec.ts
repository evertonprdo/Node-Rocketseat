import { execSync } from 'node:child_process'

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new session and set cookies', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Everton Prdo',
        email: 'mail@example.com',
        password: '123456',
      })
      .expect(201)

    const response = await request(app.server)
      .post('/sessions')
      .send({
        email: 'mail@example.com',
        password: '123456',
      })
      .expect(201)

    const cookies = response.get('Set-Cookie') as string[]

    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/userId=([a-f0-9-]+)/),
        expect.stringMatching(/sessionId=([a-f0-9-]+)/),
      ]),
    )
  })
})
