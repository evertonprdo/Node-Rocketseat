import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { DomainEvents } from '@/core/events/domain-events'

import { PrismaService } from '../database/prisma/prisma.service'

import { CustomerFactory } from '../_test/factories/admin/customer.factory'
import { AccessTokenFactory } from '../_test/factories/access-token.factory'

import { AppModule } from '../app.module'
import { AdminDatabaseModule } from '../database/prisma/admin/admin-database.module'
import { DeliveryDatabaseModule } from '../database/prisma/delivery/delivery-database.module'
import { NotificationDatabaseModule } from '../database/prisma/notification/notification-database.module'

describe('On Delivery Created (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let prisma: PrismaService
  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        AdminDatabaseModule,
        NotificationDatabaseModule,
        DeliveryDatabaseModule,
      ],
      providers: [PrismaService, CustomerFactory, AccessTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    prisma = moduleRef.get(PrismaService)
    customerFactory = moduleRef.get(CustomerFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when delivery is created', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const accessToken = accessTokenFactory.makeAdmin()

    await request(app.getHttpServer())
      .post('/deliveries')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        customerId: customer.id.toString(),
      })

    await vi.waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: customer.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
