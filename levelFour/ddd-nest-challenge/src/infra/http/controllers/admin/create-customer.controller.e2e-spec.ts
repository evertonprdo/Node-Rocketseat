import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { makeCEP } from '@/domain/_shared/_tests/factories/make-cep'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create Customer (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [AccessTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /customers', async () => {
    const customerProps = {
      name: 'Nicodemos',
      email: 'test@email.com',
      cep: makeCEP(),
      city: 'city',
      state: 'state',
      street: 'street',
      number: '123',
      neighborhood: 'neighborhood',
    }

    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(customerProps)

    expect(response.statusCode).toBe(201)

    const customerOnDatabase = await prisma.customer.findUnique({
      where: {
        email: 'test@email.com',
      },
    })

    expect(customerOnDatabase).toBeTruthy()
    expect(customerOnDatabase).toEqual(expect.objectContaining(customerProps))
  })

  test('[POST] /customers, Roles: [ADMIN]', async () => {
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
