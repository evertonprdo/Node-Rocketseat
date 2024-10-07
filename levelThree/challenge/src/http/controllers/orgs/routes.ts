import { FastifyInstance } from 'fastify'
import { createOrg } from './create'
import { authenticateOrg } from './authenticate'
import { refresh } from './refresh'

export async function orgRoutes(app: FastifyInstance) {
  app.post('/orgs', createOrg)
  app.post('/sessions', authenticateOrg)

  app.patch('/token/refresh', refresh)
}
