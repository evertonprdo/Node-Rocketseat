import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { DeliveryWorkerFactory } from '@/infra/_test/factories/admin/delivery-worker.factory'

describe('Get Delivery Worker (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService

  let userFactory: UserFactory
  let deliveryWorkerFactory: DeliveryWorkerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [UserFactory, DeliveryWorkerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)
    deliveryWorkerFactory = moduleRef.get(DeliveryWorkerFactory)

    await app.init()
  })

  test('[GET] /delivery-workers/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const deliveryWorker = await deliveryWorkerFactory.makePrismaDeliveryWorker(
      { userId: user.id },
    )

    const accessToken = jwt.sign({
      sub: deliveryWorker.id.toString(),
      roles: ['USER', 'ADMIN'],
    })

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
    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'DELIVERY_WORKER'],
    })

    const response = await request(app.getHttpServer())
      .get('/delivery-workers/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
