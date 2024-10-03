import { randomUUID } from 'node:crypto'

import { FastifyInstance } from 'fastify'
import { hash } from 'bcryptjs'
import { z } from 'zod'

import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    '/me',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const user = await knex('users')
        .select('name', 'email')
        .where({
          id: request.cookies.userId,
        })
        .first()

      if (!user) {
        return reply.status(404).send()
      }

      const meals = await knex('meals')
        .where('user_id', request.cookies.userId)
        .orderBy('date_time', 'asc')
        .select('date_time', 'within_diet')

      const statistics = {
        meal_amount: meals.length,
        within_diet: 0,
        outside_diet: 0,
        within_best_streak: 0,
      }

      let withinStreak = 0

      meals.reduce((statistic, meal) => {
        if (!meal.within_diet) {
          statistic.outside_diet++
          withinStreak = 0

          return statistic
        }

        withinStreak++
        statistic.within_diet++

        if (withinStreak > statistic.within_best_streak) {
          statistic.within_best_streak = withinStreak
        }

        return statistic
      }, statistics)

      return { user, statistics }
    },
  )

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const [{ id }] = await knex('users')
      .insert({
        id: randomUUID(),
        name,
        email,
        password_hash: await hash(password, 6),
      })
      .returning('id')

    return reply.status(201).send({
      user_id: id,
    })
  })
}
