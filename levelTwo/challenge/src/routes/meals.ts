import { randomUUID } from 'node:crypto'

import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async (request) => {
    const meals = await knex('meals')
      .where('user_id', request.cookies.userId)
      .select('*')

    return { meals }
  })

  app.get('/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const meal = await knex('meals')
      .where({
        id,
        user_id: request.cookies.userId,
      })
      .first()

    if (!meal) {
      return reply.status(404).send()
    }

    return { meal }
  })

  app.post(
    '/',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const createUserBodySchema = z.object({
        name: z.string().min(3).max(32),
        description: z.string().min(12).max(255),
        date_time: z.coerce.date(),
        within_diet: z.boolean(),
      })

      const { name, description, date_time, within_diet } =
        createUserBodySchema.parse(request.body)

      const [meal] = await knex('meals')
        .insert({
          id: randomUUID(),
          name,
          description,
          date_time,
          within_diet,
          user_id: request.cookies.userId,
        })
        .returning('*')

      return reply.status(201).send({
        meal,
      })
    },
  )

  app.put(
    '/:id',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const putMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const putMealsBodySchema = z.object({
        name: z.string().min(3).max(32),
        description: z.string().min(12).max(255),
        date_time: z.coerce.date(),
        within_diet: z.boolean(),
      })

      const { id } = putMealsParamsSchema.parse(request.params)
      const { name, description, date_time, within_diet } =
        putMealsBodySchema.parse(request.body)

      const affectedRows = await knex('meals')
        .where({
          id,
          user_id: request.cookies.userId,
        })
        .update({
          name,
          description,
          date_time,
          within_diet,
          updated_at: new Date(),
        })

      if (affectedRows === 0) {
        return reply
          .status(404)
          .send(`Meal ${id} not found to user ${request.cookies.userId}`)
      }

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const deleteMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteMealsParamsSchema.parse(request.params)

      const affectedRows = await knex('meals')
        .where({
          id,
          user_id: request.cookies.userId,
        })
        .delete()

      if (affectedRows === 0) {
        return reply
          .status(404)
          .send(`Meal ${id} not found to user ${request.cookies.userId}`)
      }

      return reply.status(204).send()
    },
  )
}
