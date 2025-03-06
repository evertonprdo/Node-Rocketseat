import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { AdminFactory } from '@/infra/_test/factories/admin/admin.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit Admin (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let prisma: PrismaService
  let userFactory: UserFactory
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [UserFactory, AdminFactory, AccessTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[PUT] /admins/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const admin = await adminFactory.makePrismaAdmin({
      userId: user.id,
      email: 'old@email.com',
    })

    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .put(`/admins/${admin.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'new@email.com',
      })

    expect(response.statusCode).toBe(204)

    const adminOnDatabase = await prisma.admin.findUnique({
      where: {
        id: admin.id.toString(),
      },
    })

    expect(adminOnDatabase).toBeTruthy()
    expect(adminOnDatabase).toEqual(
      expect.objectContaining({
        id: admin.id.toString(),
        userId: user.id.toString(),
        email: 'new@email.com',
      }),
    )
  })

  test('[PUT] /admins/:id, Roles: [ADMIN]', async () => {
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .put('/admins/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
