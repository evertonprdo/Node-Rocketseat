import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'
import { DeliveryWorkerFactory } from '@/infra/_test/factories/admin/delivery-worker.factory'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit DeliveryWorker (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let prisma: PrismaService
  let userFactory: UserFactory
  let deliveryWorkerFactory: DeliveryWorkerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [UserFactory, DeliveryWorkerFactory, AccessTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    deliveryWorkerFactory = moduleRef.get(DeliveryWorkerFactory)

    await app.init()
  })

  test('[PUT] /delivery-workers/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const deliveryWorker = await deliveryWorkerFactory.makePrismaDeliveryWorker(
      {
        userId: user.id,
        operationZone: 'Old Town',
      },
    )

    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .put(`/delivery-workers/${deliveryWorker.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        operationZone: 'New Town',
      })

    expect(response.statusCode).toBe(204)

    const deliveryWorkerOnDatabase = await prisma.deliveryWorker.findUnique({
      where: {
        id: deliveryWorker.id.toString(),
      },
    })

    expect(deliveryWorkerOnDatabase).toBeTruthy()
    expect(deliveryWorkerOnDatabase).toEqual(
      expect.objectContaining({
        id: deliveryWorker.id.toString(),
        userId: user.id.toString(),
        operationZone: 'New Town',
      }),
    )
  })

  test('[PUT] /delivery-workers/:id, Roles: [ADMIN]', async () => {
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .put('/delivery-workers/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
