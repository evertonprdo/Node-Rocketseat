import { FastifyInstance } from 'fastify'
import { hash } from 'bcryptjs'
import request from 'supertest'

import { makeRandomOrg } from '@__tests__/factories/make-random-org'
import { prisma } from '@/lib/prisma'

export async function createAndAuthenticateOrg(app: FastifyInstance) {
  const randomOrg = makeRandomOrg()

  await prisma.org.create({
    data: {
      ...randomOrg,
      password: await hash(randomOrg.password, 6),
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: randomOrg.email,
    password: randomOrg.password,
  })

  const { token } = authResponse.body

  return { token, org: randomOrg }
}
