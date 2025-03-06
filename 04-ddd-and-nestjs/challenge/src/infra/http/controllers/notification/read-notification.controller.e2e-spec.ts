import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'
import { NotificationFactory } from '@/infra/_test/factories/notification/notification.factory'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'
import { NotificationDatabaseModule } from '@/infra/database/prisma/notification/notification-database.module'

describe('Read notification (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let prisma: PrismaService
  let userFactory: UserFactory
  let notificationFactory: NotificationFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, NotificationDatabaseModule, AdminDatabaseModule],
      providers: [
        PrismaService,
        UserFactory,
        NotificationFactory,
        AccessTokenFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    notificationFactory = moduleRef.get(NotificationFactory)

    await app.init()
  })

  test('[PATCH] /notification/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    })

    const accessToken = accessTokenFactory.makeUser({
      sub: user.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    console.log(response.body)

    expect(response.statusCode).toEqual(204)

    const notificationOnDatabase = await prisma.notification.findUnique({
      where: {
        id: notification.id.toString(),
      },
    })

    expect(notificationOnDatabase).toBeTruthy()
    expect(notificationOnDatabase).toMatchObject({
      readAt: expect.any(Date),
    })
  })

  test('[GET] /app/deliveries/:id/return, roles: [USER]', async () => {
    const response = await request(app.getHttpServer()).get(
      '/notifications/any-uuid',
    )

    expect(response.statusCode).toBe(401)
  })
})
