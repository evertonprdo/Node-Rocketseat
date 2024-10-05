import { FastifyInstance } from 'fastify'
import { createOrg } from './create'

export async function orgRoutes(app: FastifyInstance) {
  app.post('/orgs', createOrg)
}
