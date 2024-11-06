import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { CustomerFactory } from '@/infra/_test/factories/admin/customer.factory'

describe('Fetch Customers (e2e)', () => {
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

  test('[GET] /customers', async () => {
    const customers = await Promise.all(
      Array.from({ length: 3 }, () => customerFactory.makePrismaCustomer()),
    )

    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'ADMIN'],
    })

    const response = await request(app.getHttpServer())
      .get('/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ page: 1 })

    expect(response.statusCode).toBe(200)
    expect(response.body.customers).toHaveLength(3)
    expect(response.body.customers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: customers[0].id.toString() }),
        expect.objectContaining({ id: customers[1].id.toString() }),
        expect.objectContaining({ id: customers[2].id.toString() }),
      ]),
    )
  })

  test('[GET] /customers/:id, Roles: [ADMIN]', async () => {
    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'DELIVERY_WORKER'],
    })

    const response = await request(app.getHttpServer())
      .get('/customers')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
