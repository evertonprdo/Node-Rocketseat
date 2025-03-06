import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'
import { DeliveryFactory } from '@/infra/_test/factories/delivery/delivery.factory'
import { ReceiverFactory } from '@/infra/_test/factories/delivery/receiver.factory'
import { AttachmentFactory } from '@/infra/_test/factories/delivery/attachment.factory'

import { AppModule } from '@/infra/app.module'
import { DeliveryDatabaseModule } from '@/infra/database/prisma/delivery/delivery-database.module'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DeliveryWorkerFactory } from '@/infra/_test/factories/delivery/delivery-worker.factory'

describe('Mark Delivery As Delivered', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let prisma: PrismaService
  let attachmentFactory: AttachmentFactory
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
        AttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    prisma = moduleRef.get(PrismaService)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    receiverFactory = moduleRef.get(ReceiverFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliveryWorkerFactory = moduleRef.get(DeliveryWorkerFactory)

    await app.init()
  })

  test('[PATCH] /app/deliveries/:id/deliver', async () => {
    const receiver = await receiverFactory.makePrismaReceiver()
    const deliveryWorker = await deliveryWorkerFactory.makePrismaDeliveryWorker(
      {
        operationCity: receiver.address.city,
      },
    )

    const delivery = await deliveryFactory.makePrismaDelivery({
      status: 'PICKED_UP',
      receiverId: receiver.id,
      pickedUpAt: new Date(),
      deliveryWorkerId: deliveryWorker.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    const accessToken = accessTokenFactory.makeDeliveryWorker({
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .patch(`/app/deliveries/${delivery.id.toString()}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachmentId: attachment.id.toString(),
      })

    expect(response.statusCode).toBe(204)

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: delivery.id.toString(),
      },
    })

    expect(deliveryOnDatabase).toBeTruthy()
    expect(deliveryOnDatabase).toMatchObject({
      status: 'DELIVERED',
      deliveryWorkerId: deliveryWorker.id.toString(),
      deliveredAt: expect.any(Date),
      attachmentId: attachment.id.toString(),
    })
  })

  test('[PATCH] /app/deliveries/:id/deliver, roles: [DELIVERY_WORKER]', async () => {
    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .patch('/app/deliveries/any-uuid/deliver')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
