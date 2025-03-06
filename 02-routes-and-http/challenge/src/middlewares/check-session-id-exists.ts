import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId
  const userId = request.cookies.userId

  if (!sessionId || !userId) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }

  const session = await knex('users')
    .where({ id: userId, session_id: sessionId })
    .first()

  if (!session) {
    return reply.status(401).send({
      error: 'Unauthorized. Invalid session.',
    })
  }
}
