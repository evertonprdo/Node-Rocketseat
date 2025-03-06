import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { makeAddress } from '@/domain/_shared/_tests/factories/make-address'

import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'
import { DeliveryFactory } from '@/infra/_test/factories/delivery/delivery.factory'
import { ReceiverFactory } from '@/infra/_test/factories/delivery/receiver.factory'
import { DeliveryWorkerFactory } from '@/infra/_test/factories/delivery/delivery-worker.factory'

import { AppModule } from '@/infra/app.module'
import { DeliveryDatabaseModule } from '@/infra/database/prisma/delivery/delivery-database.module'

describe('Fetch Deliveries To Delivery', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let receiverFactory: ReceiverFactory
  let deliveryFactory: DeliveryFactory
  let deliveryWorkerFactory: DeliveryWorkerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DeliveryDatabaseModule],
      providers: [
        ReceiverFactory,
        DeliveryFactory,
        DeliveryWorkerFactory,
        AccessTokenFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    accessTokenFactory = moduleRef.get(AccessTokenFactory)
    receiverFactory = moduleRef.get(ReceiverFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliveryWorkerFactory = moduleRef.get(DeliveryWorkerFactory)

    await app.init()
  })

  test('[GET] /app/deliveries/to-delivery', async () => {
    const city = 'test-town'

    const receivers = await Promise.all(
      Array.from({ length: 3 }, () => {
        const address = makeAddress({ city })
        return receiverFactory.makePrismaReceiver({ address })
      }),
    )

    const deliveryWorker = await deliveryWorkerFactory.makePrismaDeliveryWorker(
      { operationCity: city },
    )

    const deliveries = await Promise.all(
      receivers.map((receiver) =>
        deliveryFactory.makePrismaDelivery({
          status: 'PICKED_UP',
          receiverId: receiver.id,
          pickedUpAt: new Date(),
          deliveredAt: new Date(),
          deliveryWorkerId: deliveryWorker.id,
        }),
      ),
    )

    await Promise.all(
      receivers.map((receiver) =>
        deliveryFactory.makePrismaDelivery({
          status: 'DELIVERED',
          receiverId: receiver.id,
          pickedUpAt: new Date(),
          deliveryWorkerId: deliveryWorker.id,
        }),
      ),
    )

    const accessToken = accessTokenFactory.makeDeliveryWorker({
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get('/app/deliveries/to-delivery')
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

  test('[GET] /app/deliveries/to-delivery, roles: [DELIVERY_WORKER]', async () => {
    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .get('/app/deliveries/to-delivery')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
