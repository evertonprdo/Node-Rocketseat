import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { makeAddress } from '@/domain/_shared/_tests/factories/make-address'

import { DeliveryFactory } from '@/infra/_test/factories/delivery/delivery.factory'
import { ReceiverFactory } from '@/infra/_test/factories/delivery/receiver.factory'
import { DeliveryWorkerFactory } from '@/infra/_test/factories/delivery/delivery-worker.factory'

import { AppModule } from '@/infra/app.module'
import { DeliveryDatabaseModule } from '@/infra/database/prisma/delivery/delivery-database.module'

describe('Fetch Pending Deliveries Nearby', () => {
  let app: INestApplication
  let jwt: JwtService

  let receiverFactory: ReceiverFactory
  let deliveryFactory: DeliveryFactory
  let deliveryWorkerFactory: DeliveryWorkerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DeliveryDatabaseModule],
      providers: [ReceiverFactory, DeliveryFactory, DeliveryWorkerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    receiverFactory = moduleRef.get(ReceiverFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliveryWorkerFactory = moduleRef.get(DeliveryWorkerFactory)

    await app.init()
  })

  test('[GET] /deliveries/nearby', async () => {
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
          receiverId: receiver.id,
        }),
      ),
    )

    const accessToken = jwt.sign({
      sub: deliveryWorker.id.toString(),
      roles: ['USER', 'DELIVERY_WORKER'],
    })

    const response = await request(app.getHttpServer())
      .get('/app/deliveries/nearby')
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
})
