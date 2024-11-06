import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { AdminFactory } from '@/infra/_test/factories/admin/admin.factory'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Unassign Admin (e2e)', () => {
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

  test('[DELETE] /admins/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const admin = await adminFactory.makePrismaAdmin({ userId: user.id })

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      roles: ['USER', 'ADMIN'],
    })

    const response = await request(app.getHttpServer())
      .delete(`/admins/${admin.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const adminOnDatabase = await prisma.admin.findUnique({
      where: {
        id: admin.id.toString(),
      },
    })

    expect(adminOnDatabase).toBeNull()
  })

  test('[DELETE] /admins/:id, Roles: [ADMIN]', async () => {
    const accessToken = jwt.sign({
      sub: new UniqueEntityId().toString(),
      roles: ['USER', 'DELIVERY_WORKER'],
    })

    const response = await request(app.getHttpServer())
      .delete('/admins/any-uuid')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
