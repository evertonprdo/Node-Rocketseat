import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit User (e2e)', () => {
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

  test('[PUT] /users/:id', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'ADMIN'],
    })

    const response = await request(app.getHttpServer())
      .put(`/users/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Augustus Nicodemos',
        phone: '+5577988885555',
        password: '123456',
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    })

    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase).toEqual(
      expect.objectContaining({
        name: 'Augustus Nicodemos',
        phone: '+5577988885555',
      }),
    )
  })

  test('[PUT] /users/:id, Roles: [ADMIN]', async () => {
    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'DELIVERY_WORKER'],
    })

    const response = await request(app.getHttpServer())
      .put('/users/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
