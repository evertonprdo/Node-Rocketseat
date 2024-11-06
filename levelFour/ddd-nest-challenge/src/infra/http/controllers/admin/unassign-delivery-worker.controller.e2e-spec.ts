import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { DeliveryWorkerFactory } from '@/infra/_test/factories/admin/delivery-worker.factory'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Unassign Delivery Worker (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService

  let prisma: PrismaService
  let userFactory: UserFactory
  let deliveryWorkerFactory: DeliveryWorkerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [UserFactory, DeliveryWorkerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    deliveryWorkerFactory = moduleRef.get(DeliveryWorkerFactory)

    await app.init()
  })

  test('[DELETE] /delivery-workers/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const deliveryWorker = await deliveryWorkerFactory.makePrismaDeliveryWorker(
      { userId: user.id },
    )

    const accessToken = jwt.sign({
      sub: deliveryWorker.id.toString(),
      roles: ['USER', 'ADMIN'],
    })

    const response = await request(app.getHttpServer())
      .delete(`/delivery-workers/${deliveryWorker.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const deliveryWorkerOnDatabase = await prisma.deliveryWorker.findUnique({
      where: {
        id: deliveryWorker.id.toString(),
      },
    })

    expect(deliveryWorkerOnDatabase).toBeNull()
  })

  test('[DELETE] /delivery-workers/:id, Roles: [ADMIN]', async () => {
    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'DELIVERY_WORKER'],
    })

    const response = await request(app.getHttpServer())
      .delete('/delivery-workers/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
