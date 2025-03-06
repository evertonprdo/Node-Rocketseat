import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

describe('Get User (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule],
      providers: [UserFactory, AccessTokenFactory, AccessTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[GET] /users/:userId', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = accessTokenFactory.makeAdmin()

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

  test('[GET] /users/:id, Roles: [ADMIN]', async () => {
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .get('/users/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
