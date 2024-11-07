import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'
import { DeliveryWorkerFactory } from '@/infra/_test/factories/admin/delivery-worker.factory'

describe('Get Delivery Worker (e2e)', () => {
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
    const user = await userFactory.makePrismaUser()
    const deliveryWorker = await deliveryWorkerFactory.makePrismaDeliveryWorker(
      { userId: user.id },
    )

    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .get(`/delivery-workers/${deliveryWorker.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.deliveryWorker).toMatchObject({
      deliveryWorkerId: deliveryWorker.id.toString(),
      userId: deliveryWorker.userId.toString(),
      cpf: user.cpf.toDecorated(),
      name: user.name,
      operationZone: deliveryWorker.operationZone,
      phone: user.phone,
    })
  })

  test('[GET] /delivery-workers/:id, Roles: [ADMIN]', async () => {
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .get('/delivery-workers/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
