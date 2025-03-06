import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { UserFactory } from '@/infra/_test/factories/admin/user.factory'
import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'
import { NotificationFactory } from '@/infra/_test/factories/notification/notification.factory'

import { AppModule } from '@/infra/app.module'
import { AdminDatabaseModule } from '@/infra/database/prisma/admin/admin-database.module'
import { NotificationDatabaseModule } from '@/infra/database/prisma/notification/notification-database.module'

describe('Get Notification (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let userFactory: UserFactory
  let notificationFactory: NotificationFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AdminDatabaseModule, NotificationDatabaseModule],
      providers: [AccessTokenFactory, UserFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    userFactory = moduleRef.get(UserFactory)
    notificationFactory = moduleRef.get(NotificationFactory)

    await app.init()
  })

  test('[GET] /notifications/:id', async () => {
    const user = await userFactory.makePrismaUser()

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    })

    const accessToken = accessTokenFactory.makeUser({
      sub: user.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get(`/notifications/${notification.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.notification).toMatchObject({
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      content: notification.content,
    })
  })

  test('[GET] /notifications/:id, roles: [USER]', async () => {
    const response = await request(app.getHttpServer()).get(
      '/notifications/any-uuid',
    )

    expect(response.statusCode).toBe(401)
  })
})
