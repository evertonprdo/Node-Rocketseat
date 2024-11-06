import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CustomerFactory } from '@/infra/_test/factories/admin/customer.factory'

describe('Edit Customer (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService

  let prisma: PrismaService
  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [CustomerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    prisma = moduleRef.get(PrismaService)
    customerFactory = moduleRef.get(CustomerFactory)

    await app.init()
  })

  test('[PUT] customers/:id', async () => {
    const customer = await customerFactory.makePrismaCustomer({
      name: 'Old Name',
      email: 'old@email.com',
    })

    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'ADMIN'],
    })

    const response = await request(app.getHttpServer())
      .put(`/customers/${customer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'new-name',
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
      name: 'new-name',
      email: 'new@email.com',
    })
  })

  test('[PUT] /customers/:id, Roles: [ADMIN]', async () => {
    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'DELIVERY_WORKER'],
    })

    const response = await request(app.getHttpServer())
      .put('/customers/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
