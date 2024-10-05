import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error'
import { makeCreateOrgUseCase } from '@/use-cases/factories/make-create-org-use-case'

export async function createOrg(request: FastifyRequest, reply: FastifyReply) {
  const createOrgBodySchema = z.object({
    name: z.string().trim().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    whatsapp: z.string(),
    cep: z.string(),
    state: z.string(),
    city: z.string(),
    address: z.string(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
  })

  const {
    name,
    email,
    password,
    whatsapp,
    cep,
    city,
    state,
    address,
    latitude,
    longitude,
  } = createOrgBodySchema.parse(request.body)

  try {
    const createOrgUseCase = makeCreateOrgUseCase()

    await createOrgUseCase.execute({
      name,
      email,
      password,
      whatsapp,
      cep,
      city,
      state,
      address,
      latitude,
      longitude,
    })
  } catch (error) {
    if (error instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
