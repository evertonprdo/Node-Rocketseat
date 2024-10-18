import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

import { NestRegisterAdminUseCase } from '../use-cases/delivery/nest-register-admin.use-case'
import { RegisterAdminController } from './controllers/register-admin.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterAdminController],
  providers: [NestRegisterAdminUseCase],
})
export class HttpModule {}
