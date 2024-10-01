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
        .select('id', 'name', 'email')
        .where({
          id: request.cookies.userId,
        })
        .first()

      if (!user) {
        return reply.status(404).send()
      }

      return { user }
    },
  )

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const [userId] = await knex('users')
      .insert({
        id: randomUUID(),
        name,
        email,
        password_hash: await hash(password, 6),
      })
      .returning('id')

    return reply.status(201).send({
      user_id: userId,
    })
  })
}
