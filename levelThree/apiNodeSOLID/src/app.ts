import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'

import { env } from './env'

import { gymRoutes } from '@/http/controllers/gyms/routes'
import { userRoutes } from '@/http/controllers/users/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'

const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(userRoutes)
app.register(gymRoutes)
app.register(checkInsRoutes)

app.setErrorHandler(async (error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})

export { app }
