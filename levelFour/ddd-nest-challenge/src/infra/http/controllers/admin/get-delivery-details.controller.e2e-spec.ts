import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { DeliveryFactory } from '@/infra/_test/factories/admin/delivery.factory'
import { CustomerFactory } from '@/infra/_test/factories/admin/customer.factory'
import { DeliveryWorkerFactory } from '@/infra/_test/factories/admin/delivery-worker.factory'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

describe('Get Delivery Details (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService

  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let deliveryWorkerFactory: DeliveryWorkerFactory
  let deliveryFactory: DeliveryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [
        UserFactory,
        CustomerFactory,
        DeliveryFactory,
        DeliveryWorkerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    deliveryWorkerFactory = moduleRef.get(DeliveryWorkerFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)

    await app.init()
  })

  test('[GET] /deliveries/:id', async () => {
    const user = await userFactory.makePrismaUser()

    const deliveryWorker = await deliveryWorkerFactory.makePrismaDeliveryWorker(
      { userId: user.id },
    )

    const customer = await customerFactory.makePrismaCustomer()

    const createdAt = new Date()
    const pickedUpAt = new Date()
    const updatedAt = new Date()

    const delivery = await deliveryFactory.makePrismaDelivery({
      status: 'PICKED_UP',
      customerId: customer.id,
      deliveryWorkerId: deliveryWorker.id,
      createdAt,
      pickedUpAt,
      updatedAt,
    })

    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'ADMIN'],
    })

    const response = await request(app.getHttpServer())
      .get(`/deliveries/${delivery.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    expect(response.body.delivery).toMatchObject({
      status: 'PICKED_UP',
      pickedUpAt: new Date(pickedUpAt).toISOString(),
      createdAt: new Date(createdAt).toISOString(),
      updatedAt: new Date(updatedAt).toISOString(),

      customer: expect.objectContaining({
        id: customer.id.toString(),
      }),

      deliveryWorker: expect.objectContaining({
        id: deliveryWorker.id.toString(),
      }),
    })
  })

  test('[GET] /deliveries/:id, Roles: [ADMIN]', async () => {
    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'DELIVERY_WORKER'],
    })

    const response = await request(app.getHttpServer())
      .get('/deliveries/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
