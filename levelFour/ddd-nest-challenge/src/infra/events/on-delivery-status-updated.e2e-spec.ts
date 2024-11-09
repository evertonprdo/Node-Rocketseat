import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { DomainEvents } from '@/core/events/domain-events'

import { PrismaService } from '../database/prisma/prisma.service'

import { CustomerFactory } from '../_test/factories/admin/customer.factory'
import { DeliveryFactory } from '../_test/factories/admin/delivery.factory'
import { AccessTokenFactory } from '../_test/factories/access-token.factory'
import { ReceiverFactory } from '../_test/factories/delivery/receiver.factory'
import { DeliveryWorkerFactory } from '../_test/factories/delivery/delivery-worker.factory'

import { AppModule } from '../app.module'
import { AdminDatabaseModule } from '../database/prisma/admin/admin-database.module'
import { DeliveryDatabaseModule } from '../database/prisma/delivery/delivery-database.module'
import { NotificationDatabaseModule } from '../database/prisma/notification/notification-database.module'

describe('On Delivery Created (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let prisma: PrismaService
  let receiverFactory: ReceiverFactory
  let deliveryFactory: DeliveryFactory
  let deliveryWorkerFactory: DeliveryWorkerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        AdminDatabaseModule,
        NotificationDatabaseModule,
        DeliveryDatabaseModule,
      ],
      providers: [
        PrismaService,
        CustomerFactory,
        AccessTokenFactory,
        DeliveryFactory,
        DeliveryWorkerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    prisma = moduleRef.get(PrismaService)
    receiverFactory = moduleRef.get(CustomerFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliveryWorkerFactory = moduleRef.get(DeliveryWorkerFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when delivery is created', async () => {
    const receiver = await receiverFactory.makePrismaReceiver()

    const deliveryWorker = await deliveryWorkerFactory.makePrismaDeliveryWorker(
      {
        operationCity: receiver.address.city,
      },
    )

    const delivery = await deliveryFactory.makePrismaDelivery()

    const accessToken = accessTokenFactory.makeDeliveryWorker({
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    await request(app.getHttpServer())
      .put(`app/deliveries/${delivery.id.toString()}/pick-up`)
      .set('Authorization', `Bearer ${accessToken}`)

    await vi.waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: receiver.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
      expect(notificationOnDatabase).toMatchObject({
        readAt: expect.any(Date),
      })
    })
  })
})
