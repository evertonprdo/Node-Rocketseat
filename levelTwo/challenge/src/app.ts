import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'

import { usersRoutes } from './routes/users'
import { sessionsRoutes } from './routes/sessions'
import { mealsRoutes } from './routes/meals'

const app = fastify()

app.register(fastifyCookie)

app.register(usersRoutes, { prefix: '/users' })
app.register(sessionsRoutes, { prefix: '/sessions' })

app.register(mealsRoutes, { prefix: '/meals' })

export { app }
