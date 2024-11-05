import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { hash } from 'bcryptjs'

import { AppModule } from '@/infra/app.module'
import { UserFactory } from '@/infra/_test/factories/authentication/make-user'
import { AuthDatabaseModule } from '@/infra/database/prisma/authentication/auth-database.module'

describe('Authenticate (e2e)', () => {
  let app: INestApplication
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthDatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /auth/login', async () => {
    const user = await userFactory.makePrismaUser({
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        cpf: user.cpf.toDecorated(),
        password: '123456',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
