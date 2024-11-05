import { Module } from '@nestjs/common'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { AdminDatabaseModule } from '../database/prisma/admin/admin-database.module'
import { AuthDatabaseModule } from '../database/prisma/authentication/auth-database.module'

import { GetUserController } from './controllers/admin/get-user.controller'
import { RegisterController } from './controllers/admin/register.controller'
import { EditUserController } from './controllers/admin/edit-user.controller'
import { GetAdminController } from './controllers/admin/get-admin.controller'
import { EditAdminController } from './controllers/admin/edit-admin.controller'
import { FetchUsersController } from './controllers/admin/fetch-users.controller'
import { DeleteUserController } from './controllers/admin/delete-user.controller'
import { AssignAdminController } from './controllers/admin/assign-admin.controller'
import { AuthenticateController } from './controllers/auth/authenticate.controller'
import { UnassignAdminController } from './controllers/admin/unassign-admin.controller'

import { NestGetUserUseCase } from '../injectable-use-cases/admin/nest-get-user.use-case'
import { NestRegisterUseCase } from '../injectable-use-cases/admin/nest-register.use-case'
import { NestEditUserUseCase } from '../injectable-use-cases/admin/nest-edit-user.use-case'
import { NestGetAdminUseCase } from '../injectable-use-cases/admin/nest-get-admin.use-case'
import { NestEditAdminUseCase } from '../injectable-use-cases/admin/nest-edit-admin.use-case'
import { NestFetchUsersUseCase } from '../injectable-use-cases/admin/nest-fetch-users.use-case'
import { NestDeleteUserUseCase } from '../injectable-use-cases/admin/nest-delete-user.use-case'
import { NestUnassignAdminUseCase } from '../injectable-use-cases/admin/nest-unassign-admin.use-case'
import { NestAssignAdminUseCase } from '../injectable-use-cases/admin/nest-assign-admin.use-case'
import { NestAuthenticateUseCase } from '../injectable-use-cases/authentication/nest-authenticate.use-case'

@Module({
  imports: [AdminDatabaseModule, AuthDatabaseModule, CryptographyModule],
  controllers: [
    RegisterController,
    AuthenticateController,
    AssignAdminController,
    GetUserController,
    FetchUsersController,
    EditUserController,
    DeleteUserController,
    UnassignAdminController,
    GetAdminController,
    EditAdminController,
  ],
  providers: [
    NestRegisterUseCase,
    NestAuthenticateUseCase,
    NestAssignAdminUseCase,
    NestGetUserUseCase,
    NestFetchUsersUseCase,
    NestEditUserUseCase,
    NestDeleteUserUseCase,
    NestUnassignAdminUseCase,
    NestGetAdminUseCase,
    NestEditAdminUseCase,
  ],
})
export class HttpModule {}
