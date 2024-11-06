import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { makeCEP } from '@/domain/_shared/_tests/factories/make-cep'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create Customer (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService

  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

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

    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'ADMIN'],
    })

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
    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'DELIVERY_WORKER'],
    })

    const response = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
