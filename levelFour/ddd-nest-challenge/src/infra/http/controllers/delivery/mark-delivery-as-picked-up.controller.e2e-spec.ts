import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'
import { DeliveryFactory } from '@/infra/_test/factories/delivery/delivery.factory'
import { ReceiverFactory } from '@/infra/_test/factories/delivery/receiver.factory'

import { AppModule } from '@/infra/app.module'
import { DeliveryDatabaseModule } from '@/infra/database/prisma/delivery/delivery-database.module'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DeliveryWorkerFactory } from '@/infra/_test/factories/delivery/delivery-worker.factory'

describe('Mark Delivery As Picked Up', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let prisma: PrismaService
  let receiverFactory: ReceiverFactory
  let deliveryFactory: DeliveryFactory
  let deliveryWorkerFactory: DeliveryWorkerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DeliveryDatabaseModule],
      providers: [
        PrismaService,
        ReceiverFactory,
        DeliveryFactory,
        DeliveryWorkerFactory,
        AccessTokenFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    prisma = moduleRef.get(PrismaService)
    receiverFactory = moduleRef.get(ReceiverFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliveryWorkerFactory = moduleRef.get(DeliveryWorkerFactory)

    await app.init()
  })

  test('[PUT] /app/deliveries/:id/pick-up', async () => {
    const receiver = await receiverFactory.makePrismaReceiver()
    const deliveryWorker = await deliveryWorkerFactory.makePrismaDeliveryWorker(
      {
        operationCity: receiver.address.city,
      },
    )

    const delivery = await deliveryFactory.makePrismaDelivery({
      receiverId: receiver.id,
    })

    const accessToken = accessTokenFactory.makeDeliveryWorker({
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .put(`/app/deliveries/${delivery.id.toString()}/pick-up`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: delivery.id.toString(),
      },
    })

    expect(deliveryOnDatabase).toBeTruthy()
    expect(deliveryOnDatabase).toMatchObject({
      status: 'PICKED_UP',
      pickedUpAt: expect.any(Date),
      deliveryWorkerId: deliveryWorker.id.toString(),
    })
  })

  test('[PUT] /app/deliveries/:id/pick-up, roles: [DELIVERY_WORKER]', async () => {
    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .put('/app/deliveries/any-uuid/pick-up')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
