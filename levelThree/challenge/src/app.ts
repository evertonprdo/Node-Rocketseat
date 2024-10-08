import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'

import { env } from './env'

import { orgRoutes } from './http/controllers/orgs/routes'
import { petRoutes } from './http/controllers/pets/routes'

const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '12m',
  },
})

app.register(fastifyCookie)

app.register(orgRoutes)
app.register(petRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})

export { app }
