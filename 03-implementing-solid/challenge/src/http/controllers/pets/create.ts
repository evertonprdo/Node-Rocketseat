import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import {
  AGE,
  ENERGY_LEVEL,
  ENVIRONMENTS_NEED,
  INDEPENDENCE_LEVEL,
  SIZE,
} from '@/utils/enums'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

import { makeAdoptReqsUseCase } from '@/use-cases/factories/make-adopt-reqs-use-case'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string().min(3).trim(),
    description: z.string().max(300),
    age: z.enum(AGE),
    size: z.enum(SIZE),
    energy_level: z.enum(ENERGY_LEVEL),
    environment_need: z.enum(ENVIRONMENTS_NEED),
    independence_level: z.enum(INDEPENDENCE_LEVEL),
    adoption_requirements: z.array(z.string().trim()),
  })

  const { adoption_requirements: adoptReqs, ...rest } =
    createPetBodySchema.parse(request.body)

  const orgId = request.user.sub

  try {
    const createPetUseCase = makeCreatePetUseCase()
    const adoptReqsUseCase = makeAdoptReqsUseCase()

    const { pet } = await createPetUseCase.execute({ ...rest, org_id: orgId })

    await adoptReqsUseCase.execute({
      petId: pet.id,
      descriptions: adoptReqs,
    })

    reply.status(201).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      reply.status(404).send({ message: error.message })
    }
  }
}
