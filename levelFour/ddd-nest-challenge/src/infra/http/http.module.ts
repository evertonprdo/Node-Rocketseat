import { Module } from '@nestjs/common'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { AdminDatabaseModule } from '../database/prisma/admin/admin-database.module'
import { AuthDatabaseModule } from '../database/prisma/authentication/auth-database.module'

import { RegisterController } from './controllers/admin/register.controller'
import { AssignAdminController } from './controllers/admin/assign-admin.controller'
import { AuthenticateController } from './controllers/auth/authenticate.controller'

import { NestRegisterUseCase } from '../injectable-use-cases/admin/nest-register.use-case'
import { NestAssignAdminUseCase } from '../injectable-use-cases/admin/nest-assign-admin.use-case'
import { NestAuthenticateUseCase } from '../injectable-use-cases/authentication/nest-authenticate.use-case'

@Module({
  imports: [AdminDatabaseModule, AuthDatabaseModule, CryptographyModule],
  controllers: [
    RegisterController,
    AuthenticateController,
    AssignAdminController,
  ],
  providers: [
    NestRegisterUseCase,
    NestAuthenticateUseCase,
    NestAssignAdminUseCase,
  ],
})
export class HttpModule {}
