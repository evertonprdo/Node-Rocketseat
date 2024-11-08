import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeliveryAttachment } from '@/domain/_shared/entities/value-objects/delivery-attachment'

import { AccessTokenFactory } from '@/infra/_test/factories/access-token.factory'
import { DeliveryFactory } from '@/infra/_test/factories/delivery/delivery.factory'
import { ReceiverFactory } from '@/infra/_test/factories/delivery/receiver.factory'
import { AttachmentFactory } from '@/infra/_test/factories/delivery/attachment.factory'
import { DeliveryWorkerFactory } from '@/infra/_test/factories/delivery/delivery-worker.factory'

import { AppModule } from '@/infra/app.module'
import { StorageModule } from '@/infra/storage/storage.module'
import { DeliveryDatabaseModule } from '@/infra/database/prisma/delivery/delivery-database.module'

describe('Get Delivery Details', () => {
  let app: INestApplication
  let accessTokenFactory: AccessTokenFactory

  let receiverFactory: ReceiverFactory
  let deliveryFactory: DeliveryFactory
  let attachmentFactory: AttachmentFactory
  let deliveryWorkerFactory: DeliveryWorkerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DeliveryDatabaseModule, StorageModule],
      providers: [
        ReceiverFactory,
        DeliveryFactory,
        AccessTokenFactory,
        AttachmentFactory,
        DeliveryWorkerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    accessTokenFactory = moduleRef.get(AccessTokenFactory)

    receiverFactory = moduleRef.get(ReceiverFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    deliveryWorkerFactory = moduleRef.get(DeliveryWorkerFactory)

    await app.init()
  })

  test('[GET] /app/deliveries/:id/details, status: PENDING', async () => {
    const receiver = await receiverFactory.makePrismaReceiver()

    const delivery = await deliveryFactory.makePrismaDelivery({
      receiverId: receiver.id,
    })

    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .get(`/app/deliveries/${delivery.id.toString()}/details`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.delivery).toMatchObject({
      deliveryId: delivery.id.toString(),
      status: delivery.status,
      createdAt: delivery.createdAt.toISOString(),

      receiver: {
        id: receiver.id.toString(),
        name: receiver.name,
        cep: receiver.address.cep.toDecorated(),
        state: receiver.address.state,
        city: receiver.address.city,
        street: receiver.address.street,
        number: receiver.address.number,
        neighborhood: receiver.address.neighborhood,
      },
    })
  })

  test('[GET] /app/deliveries/:id/details, status: DELIVERED', async () => {
    const receiver = await receiverFactory.makePrismaReceiver()

    const deliveryWorker = await deliveryWorkerFactory.makePrismaDeliveryWorker(
      {
        operationCity: receiver.address.city,
      },
    )

    const attachment = await attachmentFactory.makePrismaAttachment()

    const createdAt = new Date()
    const updatedAt = new Date()
    const pickedUpAt = new Date()
    const deliveredAt = new Date()

    const deliveryId = new UniqueEntityId()
    const delivery = await deliveryFactory.makePrismaDelivery(
      {
        status: 'DELIVERED',
        receiverId: receiver.id,
        deliveryWorkerId: deliveryWorker.id,
        createdAt,
        updatedAt,
        pickedUpAt,
        deliveredAt,
        attachment: DeliveryAttachment.create({
          attachmentId: attachment.id,
          deliveryId,
        }),
      },
      deliveryId,
    )

    const accessToken = accessTokenFactory.makeDeliveryWorker()

    const response = await request(app.getHttpServer())
      .get(`/app/deliveries/${delivery.id.toString()}/details`)
      .set('Authorization', `Bearer ${accessToken}`)

    console.log(response.body)

    expect(response.statusCode).toBe(200)
    expect(response.body.delivery).toMatchObject({
      deliveryId: delivery.id.toString(),
      status: delivery.status,
      createdAt: delivery.createdAt.toISOString(),
      updatedAt: delivery.updatedAt?.toISOString(),
      pickedUpAt: delivery.pickedUpAt?.toISOString(),
      deliveredAt: delivery.deliveredAt?.toISOString(),

      attachment: {
        id: attachment.id.toString(),
        title: attachment.title,
        url: attachment.url,
      },

      receiver: {
        id: receiver.id.toString(),
        name: receiver.name,
        cep: receiver.address.cep.toDecorated(),
        state: receiver.address.state,
        city: receiver.address.city,
        street: receiver.address.street,
        number: receiver.address.number,
        neighborhood: receiver.address.neighborhood,
      },
    })
  })

  test('[GET] /app/deliveries/:id/details, roles: [DELIVERY_WORKER]', async () => {
    const accessToken = accessTokenFactory.makeAdmin()

    const response = await request(app.getHttpServer())
      .get('/app/deliveries/any-uuid/details')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
