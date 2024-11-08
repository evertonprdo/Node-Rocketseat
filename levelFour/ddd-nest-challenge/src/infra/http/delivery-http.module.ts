import { Module } from '@nestjs/common'

import { DeliveryDatabaseModule } from '../database/prisma/delivery/delivery-database.module'

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

import { FetchDeliveredHistoryController } from './controllers/delivery/fetch-delivered-history.controller'
import { NestFetchDeliveredHistoryUseCase } from '../injectable-use-cases/delivery/nest-fetch-delivered-history'

import { FetchDeliveriesToDeliveryController } from './controllers/delivery/fetch-deliveries-to-delivery.controller'
import { NestFetchDeliveriesToDeliveryUseCase } from '../injectable-use-cases/delivery/nest-fetch-deliveries-to-delivery'

@Module({
  imports: [DeliveryDatabaseModule],
  controllers: [
    GetDeliveryDetailsController,
    FetchPendingDeliveriesNearbyController,
    MarkDeliveryAsPickedUpController,
    MarkDeliveryAsReturnedController,
    MarkDeliveryAsDeliveredController,
    FetchDeliveredHistoryController,
    FetchDeliveriesToDeliveryController,
  ],
  providers: [
    NestGetDeliveryDetailsUseCase,
    NestFetchPendingDeliveriesNearbyUseCase,
    NestMarkDeliveryAsPickedUpUseCase,
    NestMarkDeliveryAsReturnedUseCase,
    NestMarkDeliveryAsDeliveredUseCase,
    NestFetchDeliveredHistoryUseCase,
    NestFetchDeliveriesToDeliveryUseCase,
  ],
})
export class DeliveryHttpModule {}
