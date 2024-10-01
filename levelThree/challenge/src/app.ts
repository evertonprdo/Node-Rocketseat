import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'

import { usersRoutes } from './routes/users'
import { sessionsRoutes } from './routes/sessions'

const app = fastify()

app.register(fastifyCookie)

app.register(usersRoutes, { prefix: '/users' })
app.register(sessionsRoutes, { prefix: '/sessions' })

export { app }
