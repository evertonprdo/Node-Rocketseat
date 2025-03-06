import { execSync } from 'node:child_process'

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'

async function createUserAndSession() {
  await request(app.server).post('/users').send({
    name: 'Everton Prdo',
    email: 'mail@example.com',
    password: '123456',
  })

  const response = await request(app.server).post('/sessions').send({
    email: 'mail@example.com',
    password: '123456',
  })

  return response.get('Set-Cookie') as string[]
}

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    const cookies = await createUserAndSession()

    const response = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'test',
        description: 'test-description',
        date_time: '2024-10-11T20:10:22Z',
        within_diet: true,
      })
      .expect(201)

    expect(response.body).toEqual({
      meal: expect.objectContaining({
        id: expect.any(String),
        name: 'test',
        description: 'test-description',
        date_time: new Date('2024-10-11T20:10:22Z').getTime(),
        within_diet: 1,
      }),
    })
  })

  it('should be possible to delete a meal', async () => {
    const cookies = await createUserAndSession()

    const response = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'test',
        description: 'test-description',
        date_time: '2024-10-11T20:10:22Z',
        within_diet: true,
      })
      .expect(201)

    await request(app.server)
      .delete(`/meals/${response.body.meal.id}`)
      .set('Cookie', cookies)
      .expect(204)
  })

  it('should be possible to edit a meal', async () => {
    const cookies = await createUserAndSession()

    const response = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'test',
        description: 'test-description',
        date_time: '2024-10-11T20:10:22Z',
        within_diet: true,
      })
      .expect(201)

    await request(app.server)
      .put(`/meals/${response.body.meal.id}`)
      .set('Cookie', cookies)
      .send({
        name: 'put-test',
        description: 'test-description',
        date_time: '2024-10-11T20:10:22Z',
        within_diet: true,
      })
      .expect(204)

    const queryResponse = await request(app.server)
      .get(`/meals/${response.body.meal.id}`)
      .set('Cookie', cookies)
      .send()
      .expect(200)

    expect(queryResponse.body.meal.name).toEqual('put-test')
  })

  it('should be possible to get meal by id', async () => {
    const cookies = await createUserAndSession()

    const response = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'test',
        description: 'test-description',
        date_time: '2024-10-11T20:10:22Z',
        within_diet: true,
      })
      .expect(201)

    const queryResponse = await request(app.server)
      .get(`/meals/${response.body.meal.id}`)
      .set('Cookie', cookies)
      .send()
      .expect(200)

    expect(queryResponse.body.meal.name).toEqual('test')
  })

  it('should be possible to get meal by id', async () => {
    const cookies = await createUserAndSession()

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'test-1',
      description: 'test-description',
      date_time: '2024-10-11T20:10:22Z',
      within_diet: true,
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'test-2',
      description: 'test-description',
      date_time: '2024-10-11T20:10:22Z',
      within_diet: true,
    })

    const queryResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .send()
      .expect(200)

    expect(queryResponse.body.meals).toHaveLength(2)
    expect(queryResponse.body.meals[0].description).toEqual('test-description')
  })
})
