import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { CustomerFactory } from '@/infra/_test/factories/admin/customer.factory'
import { DeliveryFactory } from '@/infra/_test/factories/admin/delivery.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Delete Delivery', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let prisma: PrismaService
  let customerFactory: CustomerFactory
  let deliveryFactory: DeliveryFactory
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [
        CustomerFactory,
        DeliveryFactory,
        AccessTokenFactory,
        UserFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    prisma = moduleRef.get(PrismaService)
    customerFactory = moduleRef.get(CustomerFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[DELETE] deliveries/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const customer = await customerFactory.makePrismaCustomer({
      userId: user.id,
    })

    const delivery = await deliveryFactory.makePrismaDelivery({
      customerId: customer.id,
    })

    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .delete(`/deliveries/${delivery.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: delivery.id.toString(),
      },
    })

    expect(deliveryOnDatabase).toBeNull()
  })

  test('[DELETE] /deliveries/:id, Roles: [ADMIN]', async () => {
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .delete('/deliveries/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
