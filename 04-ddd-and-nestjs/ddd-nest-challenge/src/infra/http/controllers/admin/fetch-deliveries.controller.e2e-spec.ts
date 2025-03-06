import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { DeliveryFactory } from '@/infra/_test/factories/admin/delivery.factory'
import { CustomerFactory } from '@/infra/_test/factories/admin/customer.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

describe('Fetch Delivery (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let deliveryFactory: DeliveryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [
        UserFactory,
        CustomerFactory,
        DeliveryFactory,
        AccessTokenFactory,
        UserFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    customerFactory = moduleRef.get(CustomerFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[GET] /deliveries', async () => {
    const users = await Promise.all(
      Array.from({ length: 3 }, () => userFactory.makePrismaUser()),
    )

    const customers = await Promise.all(
      users.map((user) =>
        customerFactory.makePrismaCustomer({ userId: user.id }),
      ),
    )

    const deliveries = await Promise.all(
      customers.map((customer) =>
        deliveryFactory.makePrismaDelivery({
          customerId: customer.id,
        }),
      ),
    )

    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .get('/deliveries')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.deliveries).toHaveLength(3)

    expect(response.body.deliveries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: deliveries[0].id.toString() }),
        expect.objectContaining({ id: deliveries[1].id.toString() }),
        expect.objectContaining({ id: deliveries[2].id.toString() }),
      ]),
    )
  })

  test('[GET] /deliveries, Roles: [ADMIN]', async () => {
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .get('/deliveries')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
