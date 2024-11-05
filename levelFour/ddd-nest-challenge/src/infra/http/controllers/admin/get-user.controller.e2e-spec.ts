import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UserFactory } from '@/infra/_test/factories/admin/make-user'
import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { Test } from '@nestjs/testing'

describe('Get User (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService

  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[GET] /users/:userId', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'ADMIN'],
    })

    const response = await request(app.getHttpServer())
      .get(`/users/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      user: {
        id: user.id.toString(),
        cpf: user.cpf.toDecorated(),
        name: user.name,
        phone: user.phone,
      },
    })
  })
})
