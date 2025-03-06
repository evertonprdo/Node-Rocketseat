import { Module } from '@nestjs/common'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthDatabaseModule } from '../database/prisma/authentication/auth-database.module'

import { AuthenticateController } from './controllers/auth/authenticate.controller'
import { NestAuthenticateUseCase } from '../injectable-use-cases/authentication/nest-authenticate.use-case'

@Module({
  imports: [AuthDatabaseModule, CryptographyModule],
  controllers: [AuthenticateController],
  providers: [NestAuthenticateUseCase],
})
export class AuthHttpModule {}
