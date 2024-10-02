import { execSync } from 'node:child_process'

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'
import { knex } from '../src/database'

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

  it('should be able to create a new user', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'Everton Prdo',
        email: 'mail@example.com',
        password: '123456',
      })
      .expect(201)

    expect(response.body).toEqual({
      user_id: expect.any(String),
    })
  })

  it('should be able to get the user statistics', async () => {
    await request(app.server).post('/users').send({
      name: 'Everton Prdo',
      email: 'mail@example.com',
      password: '123456',
    })
    const createSession = await request(app.server).post('/sessions').send({
      email: 'mail@example.com',
      password: '123456',
    })

    const cookies = createSession.get('Set-Cookie') as string[]

    const userIdCookie = cookies.find((cookie) => cookie.startsWith('userId='))
    const userId = userIdCookie?.split('=')[1].split(';')[0]

    const meals = [
      { date_time: new Date('2024-10-02T09:09:23.146Z'), within_diet: true },
      { date_time: new Date('2024-10-03T09:09:23.147Z'), within_diet: false },
      { date_time: new Date('2024-10-04T09:09:23.147Z'), within_diet: true },
      { date_time: new Date('2024-10-05T09:09:23.148Z'), within_diet: true },
      { date_time: new Date('2024-10-06T09:09:23.149Z'), within_diet: false },
    ]

    await knex('meals').insert(
      meals.map((item) => ({
        ...item,
        name: 'test',
        description: 'test-descriptions',
        user_id: userId,
      })),
    )

    const statistics = await request(app.server)
      .get('/users/me')
      .set('Cookie', cookies)
      .expect(200)

    expect(statistics.body).toEqual({
      statistics: {
        meal_amount: 5,
        within_diet: 3,
        outside_diet: 2,
        within_best_streak: 2,
      },
      user: {
        name: 'Everton Prdo',
        email: 'mail@example.com',
      },
    })
  })
})
