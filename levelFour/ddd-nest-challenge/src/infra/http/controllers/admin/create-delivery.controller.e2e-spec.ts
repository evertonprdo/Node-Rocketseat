import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { CustomerFactory } from '@/infra/_test/factories/admin/customer.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create Delivery (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let prisma: PrismaService
  let customerFactory: CustomerFactory
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [CustomerFactory, AccessTokenFactory, UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    prisma = moduleRef.get(PrismaService)
    customerFactory = moduleRef.get(CustomerFactory)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /deliveries', async () => {
    const user = await userFactory.makePrismaUser()
    const customer = await customerFactory.makePrismaCustomer({
      userId: user.id,
    })

    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .post('/deliveries')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ customerId: customer.id.toString() })

    expect(response.statusCode).toBe(201)

    const deliveryOnDatabase = await prisma.delivery.findFirst({
      where: {
        customerId: customer.id.toString(),
      },
    })

    expect(deliveryOnDatabase).toBeTruthy()
    expect(deliveryOnDatabase).toMatchObject({
      status: 'PENDING',
      createdAt: expect.any(Date),
      customerId: customer.id.toString(),
    })
  })

  test('[POST] /deliveries, Roles: [ADMIN]', async () => {
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .post('/deliveries')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
