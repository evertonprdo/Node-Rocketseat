import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})

prisma.pet
  .findMany({
    include: { adoption_requirements: true },
  })
  .then((item) => item[0].adoption_requirements[0].id)
