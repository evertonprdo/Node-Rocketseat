import { Module } from '@nestjs/common'

import { DeliveryDatabaseModule } from '../database/prisma/delivery/delivery-database.module'
import { StorageModule } from '../storage/storage.module'

import { FetchPendingDeliveriesNearbyController } from './controllers/delivery/fetch-pending-deliveries-nearby.controller'
import { NestFetchPendingDeliveriesNearbyUseCase } from '../injectable-use-cases/delivery/nest-fetch-pending-deliveries-nearby.use-case'

import { GetDeliveryDetailsController } from './controllers/delivery/get-delivery-details.controller'
import { NestGetDeliveryDetailsUseCase } from '../injectable-use-cases/delivery/nest-get-delivery-details.use-case'

import { MarkDeliveryAsPickedUpController } from './controllers/delivery/mark-delivery-as-picked-up.controller'
import { NestMarkDeliveryAsPickedUpUseCase } from '../injectable-use-cases/delivery/nest-mark-delivery-as-picked-up.use-case'

import { MarkDeliveryAsReturnedController } from './controllers/delivery/mark-delivery-as-returned.controller'
import { NestMarkDeliveryAsReturnedUseCase } from '../injectable-use-cases/delivery/nest-mark-delivery-as-returned.use-case'

import { MarkDeliveryAsDeliveredController } from './controllers/delivery/mark-delivery-as-delivered.controller'
import { NestMarkDeliveryAsDeliveredUseCase } from '../injectable-use-cases/delivery/nest-mark-delivery-as-delivered.use-case'

import { FetchDeliveriesHistoryController } from './controllers/delivery/fetch-deliveries-history.controller'
import { NestFetchDeliveriesHistoryUseCase } from '../injectable-use-cases/delivery/nest-fetch-deliveries-history'

import { UploadAttachmentController } from './controllers/delivery/upload-attachment.controller'
import { NestUploadAndCreateAttachmentUseCase } from '../injectable-use-cases/delivery/nest-upload-and-create-attachment.use-case'

@Module({
  imports: [DeliveryDatabaseModule, StorageModule],
  controllers: [
    GetDeliveryDetailsController,
    FetchPendingDeliveriesNearbyController,
    MarkDeliveryAsPickedUpController,
    MarkDeliveryAsReturnedController,
    MarkDeliveryAsDeliveredController,
    FetchDeliveriesHistoryController,
    UploadAttachmentController,
  ],
  providers: [
    NestGetDeliveryDetailsUseCase,
    NestFetchPendingDeliveriesNearbyUseCase,
    NestMarkDeliveryAsPickedUpUseCase,
    NestMarkDeliveryAsReturnedUseCase,
    NestMarkDeliveryAsDeliveredUseCase,
    NestFetchDeliveriesHistoryUseCase,
    NestUploadAndCreateAttachmentUseCase,
  ],
})
export class DeliveryHttpModule {}
