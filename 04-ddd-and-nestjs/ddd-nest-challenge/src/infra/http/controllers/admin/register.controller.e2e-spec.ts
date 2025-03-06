import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Register (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /users/register', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        name: 'John Doe',
        cpf: '44650866529',
        password: '123456',
        phone: '+5599877775555',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        cpf: '44650866529',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
