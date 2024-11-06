import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { CustomerFactory } from '@/infra/_test/factories/admin/customer.factory'

describe('Get Customer (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService

  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [CustomerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    customerFactory = moduleRef.get(CustomerFactory)

    await app.init()
  })

  test('[GET] /customers/:id', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'ADMIN'],
    })

    const response = await request(app.getHttpServer())
      .get(`/customers/${customer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
  })

  test('[GET] /customers/:id, Roles: [ADMIN]', async () => {
    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'DELIVERY_WORKER'],
    })

    const response = await request(app.getHttpServer())
      .get('/customers/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
