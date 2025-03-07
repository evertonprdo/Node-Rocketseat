import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { DomainEvents } from '@/core/events/domain-events'

import { PrismaService } from '../database/prisma/prisma.service'

import { UserFactory } from '../_test/factories/admin/user.factory'
import { CustomerFactory } from '../_test/factories/admin/customer.factory'
import { DeliveryFactory } from '../_test/factories/admin/delivery.factory'
import { AccessTokenFactory } from '../_test/factories/access-token.factory'
import { DeliveryWorkerFactory } from '../_test/factories/delivery/delivery-worker.factory'

import { AppModule } from '../app.module'
import { AdminDatabaseModule } from '../database/prisma/admin/admin-database.module'
import { DeliveryDatabaseModule } from '../database/prisma/delivery/delivery-database.module'
import { NotificationDatabaseModule } from '../database/prisma/notification/notification-database.module'

describe('On Delivery Updated (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let prisma: PrismaService
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
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
        AccessTokenFactory,
        PrismaService,
        UserFactory,
        CustomerFactory,
        DeliveryFactory,
        DeliveryWorkerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)
    customerFactory = moduleRef.get(CustomerFactory)

    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliveryWorkerFactory = moduleRef.get(DeliveryWorkerFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when delivery is updated', async () => {
    const user = await userFactory.makePrismaUser()
    const customer = await customerFactory.makePrismaCustomer({
      userId: user.id,
    })

    const deliveryWorker = await deliveryWorkerFactory.makePrismaDeliveryWorker(
      {
        operationCity: customer.address.city,
      },
    )

    const delivery = await deliveryFactory.makePrismaDelivery({
      customerId: customer.id,
    })

    DomainEvents.dispatchEventsForAggregate(delivery.id)

    const accessToken = accessTokenFactory.makeDeliveryWorker({
      deliveryWorkerId: deliveryWorker.id.toString(),
    })

    await request(app.getHttpServer())
      .patch(`/app/deliveries/${delivery.id.toString()}/pick-up`)
      .set('Authorization', `Bearer ${accessToken}`)

    await vi.waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString(),
          title: {
            contains: '"PICKED_UP"',
          },
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
