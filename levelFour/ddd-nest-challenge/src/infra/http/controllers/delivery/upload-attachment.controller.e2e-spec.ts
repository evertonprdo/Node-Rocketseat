import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DeliveryDatabaseModule } from '@/infra/database/prisma/delivery/delivery-database.module'

import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'

describe('Upload attachment (e2e)', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DeliveryDatabaseModule],
      providers: [AccessTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    await app.init()
  })

  test('[POST] attachments', async () => {
    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.jpeg')

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    })
  })

  test('[POST] /app/deliveries/:id/return, roles: [DELIVERY_WORKER, ADMIN]', async () => {
    const accessToken = accessTokenFactory.makeUser()

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
