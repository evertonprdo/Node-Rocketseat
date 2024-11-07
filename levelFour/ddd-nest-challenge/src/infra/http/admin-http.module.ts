import { Module } from '@nestjs/common'

import { AdminDatabaseModule } from '../database/prisma/admin/admin-database.module'
import { DeliveryDatabaseModule } from '../database/prisma/delivery/delivery-database.module'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthDatabaseModule } from '../database/prisma/authentication/auth-database.module'

import { GetUserController } from './controllers/admin/get-user.controller'
import { NestGetUserUseCase } from '../injectable-use-cases/admin/nest-get-user.use-case'

import { RegisterController } from './controllers/admin/register.controller'
import { NestRegisterUseCase } from '../injectable-use-cases/admin/nest-register.use-case'

import { EditUserController } from './controllers/admin/edit-user.controller'
import { NestEditUserUseCase } from '../injectable-use-cases/admin/nest-edit-user.use-case'

import { GetAdminController } from './controllers/admin/get-admin.controller'
import { NestGetAdminUseCase } from '../injectable-use-cases/admin/nest-get-admin.use-case'

import { EditAdminController } from './controllers/admin/edit-admin.controller'
import { NestEditAdminUseCase } from '../injectable-use-cases/admin/nest-edit-admin.use-case'

import { FetchUsersController } from './controllers/admin/fetch-users.controller'
import { NestFetchUsersUseCase } from '../injectable-use-cases/admin/nest-fetch-users.use-case'

import { DeleteUserController } from './controllers/admin/delete-user.controller'
import { NestDeleteUserUseCase } from '../injectable-use-cases/admin/nest-delete-user.use-case'

import { UnassignAdminController } from './controllers/admin/unassign-admin.controller'
import { NestUnassignAdminUseCase } from '../injectable-use-cases/admin/nest-unassign-admin.use-case'

import { AssignAdminController } from './controllers/admin/assign-admin.controller'
import { NestAssignAdminUseCase } from '../injectable-use-cases/admin/nest-assign-admin.use-case'

import { CreateCustomerController } from './controllers/admin/create-customer.controller'
import { NestCreateCustomerUseCase } from '../injectable-use-cases/admin/nest-create-customer.use-case'

import { GetCustomerController } from './controllers/admin/get-customer.controller'
import { NestGetCustomerUseCase } from '../injectable-use-cases/admin/nest-get-customer.use-case'

import { FetchCustomersController } from './controllers/admin/fetch-customers.controller'
import { NestFetchCustomersUseCase } from '../injectable-use-cases/admin/nest-fetch-customers.use-case'

import { EditCustomerController } from './controllers/admin/edit-customer.controller'
import { NestEditCustomerUseCase } from '../injectable-use-cases/admin/nest-edit-customer.use-case'

import { DeleteCustomerController } from './controllers/admin/delete-customer.controller'
import { NestDeleteCustomerUseCase } from '../injectable-use-cases/admin/nest-delete-customer.use-case'

import { AssignDeliveryWorkerController } from './controllers/admin/assign-delivery-worker.controller'
import { NestAssignDeliveryWorkerUseCase } from '../injectable-use-cases/admin/nest-assign-delivery-worker.use-case'

import { UnassignDeliveryWorkerController } from './controllers/admin/unassign-delivery-worker.controller'
import { NestUnassignDeliveryWorkerUseCase } from '../injectable-use-cases/admin/nest-unassign-delivery-worker.use-case'

import { GetDeliveryWorkerController } from './controllers/admin/get-delivery-worker.controller'
import { NestGetDeliveryWorkerUseCase } from '../injectable-use-cases/admin/nest-get-delivery-worker.use-case'

import { EditDeliveryWorkerController } from './controllers/admin/edit-delivery-worker.controller'
import { NestEditDeliveryWorkerUseCase } from '../injectable-use-cases/admin/nest-edit-delivery-worker.use-case'

import { FetchDeliveryWorkersController } from './controllers/admin/fetch-delivery-workers.controller'
import { NestFetchDeliveryWorkersUseCase } from '../injectable-use-cases/admin/nest-fetch-delivery-workers.use-case'

import { CreateDeliveryController } from './controllers/admin/create-delivery.controller'
import { NestCreateDeliveryUseCase } from '../injectable-use-cases/admin/nest-create-delivery.use-case'

import { GetDeliveryDetailsController } from './controllers/admin/get-delivery-details.controller'
import { NestGetDeliveryDetailsUseCase } from '../injectable-use-cases/admin/nest-get-delivery-details.use-case'

import { DeleteDeliveryController } from './controllers/admin/delete-delivery.controller'
import { NestDeleteDeliveryUseCase } from '../injectable-use-cases/admin/nest-delete-delivery.use-case'

import { FetchDeliveriesController } from './controllers/admin/fetch-deliveries.controller'
import { NestFetchDeliveriesUseCase } from '../injectable-use-cases/admin/nest-fetch-deliveries.use-case'

@Module({
  imports: [
    AdminDatabaseModule,
    DeliveryDatabaseModule,
    AuthDatabaseModule,
    CryptographyModule,
  ],
  controllers: [
    RegisterController,
    AssignAdminController,
    GetUserController,
    FetchUsersController,
    EditUserController,
    DeleteUserController,
    UnassignAdminController,
    GetAdminController,
    EditAdminController,
    CreateCustomerController,
    GetCustomerController,
    FetchCustomersController,
    EditCustomerController,
    DeleteCustomerController,
    AssignDeliveryWorkerController,
    UnassignDeliveryWorkerController,
    GetDeliveryWorkerController,
    EditDeliveryWorkerController,
    FetchDeliveryWorkersController,
    CreateDeliveryController,
    GetDeliveryDetailsController,
    DeleteDeliveryController,
    FetchDeliveriesController,
  ],
  providers: [
    NestRegisterUseCase,
    NestAssignAdminUseCase,
    NestGetUserUseCase,
    NestFetchUsersUseCase,
    NestEditUserUseCase,
    NestDeleteUserUseCase,
    NestUnassignAdminUseCase,
    NestGetAdminUseCase,
    NestEditAdminUseCase,
    NestCreateCustomerUseCase,
    NestGetCustomerUseCase,
    NestFetchCustomersUseCase,
    NestEditCustomerUseCase,
    NestDeleteCustomerUseCase,
    NestAssignDeliveryWorkerUseCase,
    NestUnassignDeliveryWorkerUseCase,
    NestGetDeliveryWorkerUseCase,
    NestEditDeliveryWorkerUseCase,
    NestFetchDeliveryWorkersUseCase,
    NestCreateDeliveryUseCase,
    NestGetDeliveryDetailsUseCase,
    NestDeleteDeliveryUseCase,
    NestFetchDeliveriesUseCase,
  ],
})
export class AdminHttpModule {}
