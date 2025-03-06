import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { create } from './create'
import { getPet } from './get-pet'
import { searchPets } from './search'

export async function petRoutes(app: FastifyInstance) {
  app.get('/pets', searchPets)
  app.get('/pets/:id', getPet)

  app.post('/pets', { onRequest: [verifyJWT] }, create)
}
