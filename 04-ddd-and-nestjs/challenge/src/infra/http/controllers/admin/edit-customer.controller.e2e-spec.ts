import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { CustomerFactory } from '@/infra/_test/factories/admin/customer.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit Customer (e2e)', () => {
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

  test('[PUT] customers/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const customer = await customerFactory.makePrismaCustomer({
      userId: user.id,
      email: 'old@email.com',
    })

    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .put(`/customers/${customer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId: user.id.toString(),
        email: 'new@email.com',
        cep: customer.address.cep.value,
        city: customer.address.city,
        state: customer.address.state,
        street: customer.address.city,
        number: customer.address.number,
        neighborhood: customer.address.neighborhood,
      })

    expect(response.statusCode).toBe(204)

    const customerOnDatabase = await prisma.customer.findUnique({
      where: {
        id: customer.id.toString(),
      },
    })

    expect(customerOnDatabase).toBeTruthy()
    expect(customerOnDatabase).toMatchObject({
      email: 'new@email.com',
    })
  })

  test('[PUT] /customers/:id, Roles: [ADMIN]', async () => {
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .put('/customers/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
