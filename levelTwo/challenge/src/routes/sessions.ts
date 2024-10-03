import { randomUUID } from 'node:crypto'

import { FastifyInstance } from 'fastify'
import { compare } from 'bcryptjs'
import { z } from 'zod'

import { knex } from '../database'

export async function sessionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createSessionBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = createSessionBodySchema.parse(request.body)

    const user = await knex('users').where('email', email).first()

    if (!user) {
      return reply.status(404).send()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      return reply.status(400).send({ message: 'Invalid E-mail or Password' })
    }

    const sessionId = randomUUID()

    await knex('users').where('id', user.id).update({
      session_id: sessionId,
      updated_at: new Date(),
    })

    reply.cookie('userId', user.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    reply.status(201).send()
  })
}
