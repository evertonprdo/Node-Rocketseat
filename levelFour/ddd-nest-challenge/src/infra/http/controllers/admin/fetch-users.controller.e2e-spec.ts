import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

describe('Fetch Users (e2e)', () => {
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

  test('[GET] /users', async () => {
    const users = await Promise.all(
      Array.from({ length: 3 }, () => userFactory.makePrismaUser()),
    )

    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'ADMIN'],
    })

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.users).toHaveLength(3)

    expect(response.body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: users[0].id.toString() }),
        expect.objectContaining({ id: users[1].id.toString() }),
        expect.objectContaining({ id: users[2].id.toString() }),
      ]),
    )
  })

  test('[GET] /users, Roles: [ADMIN]', async () => {
    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'DELIVERY_WORKER'],
    })

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
