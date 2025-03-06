import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'

import { StudentFactory } from 'test/factories/make-student'
import { NotificationFactory } from 'test/factories/make-notification'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Get questions by slug (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService

  let studentFactory: StudentFactory
  let notificationFactory: NotificationFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory, PrismaService],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    studentFactory = moduleRef.get(StudentFactory)
    notificationFactory = moduleRef.get(NotificationFactory)

    await app.init()
  })

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString(),
      },
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})
