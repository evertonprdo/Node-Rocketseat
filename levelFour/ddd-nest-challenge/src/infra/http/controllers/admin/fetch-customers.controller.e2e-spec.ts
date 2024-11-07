import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { CustomerFactory } from '@/infra/_test/factories/admin/customer.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'

describe('Fetch Customers (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [CustomerFactory, AccessTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    customerFactory = moduleRef.get(CustomerFactory)

    await app.init()
  })

  test('[GET] /customers', async () => {
    const customers = await Promise.all(
      Array.from({ length: 3 }, () => customerFactory.makePrismaCustomer()),
    )

    const accessToken = accessTokenFactory.makeAdmin()

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
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .get('/customers')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
