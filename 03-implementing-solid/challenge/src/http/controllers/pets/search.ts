import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { AGE, ENERGY_LEVEL, INDEPENDENCE_LEVEL, SIZE } from '@/utils/enums'
import { makeSearchPetsUseCase } from '@/use-cases/factories/make-search-pets-use-case'

export async function searchPets(request: FastifyRequest, reply: FastifyReply) {
  const searchPetsQuerySchema = z.object({
    city: z.string().min(3).trim(),
    age: z.enum(AGE).optional(),
    size: z.enum(SIZE).optional(),
    energy_level: z.enum(ENERGY_LEVEL).optional(),
    Independence_level: z.enum(INDEPENDENCE_LEVEL).optional(),
  })

  const query = searchPetsQuerySchema.parse(request.query)

  const searchPetsUseCase = makeSearchPetsUseCase()

  const { pets } = await searchPetsUseCase.execute(query)

  reply.status(200).send({ pets })
}
