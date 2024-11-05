import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { JwtService } from '@nestjs/jwt'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { UserFactory } from '@/infra/_test/factories/admin/make-user'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

describe('Assign Admin (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService

  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /admins/assign', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'ADMIN'],
    })

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
})
