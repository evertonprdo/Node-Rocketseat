import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Assign Admin (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [UserFactory, AccessTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /admins/assign', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .post('/admins/assign')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ userId: user.id.toString(), email: 'email@test.com' })

    expect(response.statusCode).toBe(201)

    const adminOnDatabase = await prisma.admin.findUnique({
      where: {
        email: 'email@test.com',
      },
    })

    expect(adminOnDatabase).toBeTruthy()
  })

  test('[POST] /admins/assign, Roles: [ADMIN]', async () => {
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .post('/admins/assign')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
