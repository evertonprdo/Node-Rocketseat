import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { UserFactory } from '@/infra/_test/factories/admin/make-user'
import { AdminFactory } from '@/infra/_test/factories/admin/make-admin'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit Admin (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService

  let prisma: PrismaService
  let userFactory: UserFactory
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [UserFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

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

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      roles: ['USER', 'ADMIN'],
    })

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
})
