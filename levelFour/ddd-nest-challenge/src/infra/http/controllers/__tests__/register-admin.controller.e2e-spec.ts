import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Controller: Register Admin (E2E)', () => {
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

  test('[POST] /admin/register', async () => {
    const response = await request(app.getHttpServer())
      .post('/admins/register')
      .send({
        name: 'New Admin',
        cpf: '376.147.390-78',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)

    const adminOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '37614739078',
      },
    })

    expect(adminOnDatabase).toBeTruthy()
  })
})
