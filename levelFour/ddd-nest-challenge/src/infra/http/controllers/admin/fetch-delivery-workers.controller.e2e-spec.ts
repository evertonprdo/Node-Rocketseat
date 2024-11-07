import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'
import { DeliveryWorkerFactory } from '@/infra/_test/factories/admin/delivery-worker.factory'

describe('Fetch Delivery Worker (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let userFactory: UserFactory
  let deliveryWorkerFactory: DeliveryWorkerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [UserFactory, DeliveryWorkerFactory, AccessTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    userFactory = moduleRef.get(UserFactory)
    deliveryWorkerFactory = moduleRef.get(DeliveryWorkerFactory)

    await app.init()
  })

  test('[GET] /delivery-workers/:id', async () => {
    const users = await Promise.all(
      Array.from({ length: 3 }, () => userFactory.makePrismaUser()),
    )

    const deliveryWorker = await Promise.all(
      users.map((user) =>
        deliveryWorkerFactory.makePrismaDeliveryWorker({ userId: user.id }),
      ),
    )

    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .get('/delivery-workers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ page: 1 })

    expect(response.statusCode).toBe(200)
    expect(response.body.delivery_workers).toHaveLength(3)

    expect(response.body.delivery_workers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          deliveryWorkerId: deliveryWorker[0].id.toString(),
        }),
        expect.objectContaining({
          deliveryWorkerId: deliveryWorker[1].id.toString(),
        }),
        expect.objectContaining({
          deliveryWorkerId: deliveryWorker[2].id.toString(),
        }),
      ]),
    )
  })

  test('[GET] /delivery-workers, Roles: [ADMIN]', async () => {
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .get('/delivery-workers')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
