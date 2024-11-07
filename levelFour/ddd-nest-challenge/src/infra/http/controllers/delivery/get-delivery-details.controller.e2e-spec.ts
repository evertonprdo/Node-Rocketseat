import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'
import { DeliveryFactory } from '@/infra/_test/factories/delivery/delivery.factory'
import { ReceiverFactory } from '@/infra/_test/factories/delivery/receiver.factory'

import { AppModule } from '@/infra/app.module'
import { DeliveryDatabaseModule } from '@/infra/database/prisma/delivery/delivery-database.module'

describe('Get Delivery Details', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let receiverFactory: ReceiverFactory
  let deliveryFactory: DeliveryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DeliveryDatabaseModule],
      providers: [ReceiverFactory, DeliveryFactory, AccessTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    receiverFactory = moduleRef.get(ReceiverFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)

    await app.init()
  })

  test('[GET] /app/deliveries/:id/details', async () => {
    const receiver = await receiverFactory.makePrismaReceiver()

    const delivery = await deliveryFactory.makePrismaDelivery({
      receiverId: receiver.id,
    })

    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .get(`/app/deliveries/${delivery.id.toString()}/details`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.delivery).toMatchObject({
      deliveryId: delivery.id.toString(),
      status: delivery.status,
      createdAt: delivery.createdAt.toISOString(),

      receiver: {
        id: receiver.id.toString(),
        name: receiver.name,
        cep: receiver.address.cep.toDecorated(),
        state: receiver.address.state,
        city: receiver.address.city,
        street: receiver.address.street,
        number: receiver.address.number,
        neighborhood: receiver.address.neighborhood,
      },
    })
  })

  test('[GET] /app/deliveries/:id/details, roles: [DELIVERY_WORKER]', async () => {
    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .get('/app/deliveries/any-uuid/details')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
