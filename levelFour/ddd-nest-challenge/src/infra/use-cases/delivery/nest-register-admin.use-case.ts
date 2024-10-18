import { Injectable } from '@nestjs/common'

import { RegisterAdminUseCase } from '@/domain/delivery/use-cases/register-admin.use-case'

import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaAdminsRepository } from '@/infra/database/prisma/repositories/prisma-admins.repository'

@Injectable()
export class NestRegisterAdminUseCase extends RegisterAdminUseCase {
  constructor(
    adminsRepository: PrismaAdminsRepository,
    hashGenerator: BcryptHasher,
  ) {
    super(adminsRepository, hashGenerator)
  }
}
