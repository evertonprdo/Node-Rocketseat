import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { create } from './create'
import { getPet } from './get-pet'

export async function petRoutes(app: FastifyInstance) {
  app.get('/pets/:id', getPet)

  app.post('/pets', { onRequest: [verifyJWT] }, create)
}
