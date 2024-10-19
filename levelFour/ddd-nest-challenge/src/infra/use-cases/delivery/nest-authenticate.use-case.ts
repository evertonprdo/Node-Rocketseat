import { Injectable } from '@nestjs/common'

import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { PrismaAdminsRepository } from '@/infra/database/prisma/repositories/prisma-admins.repository'

import { AuthenticateUseCase } from '@/domain/authentication/use-cases/authenticate.use-case'

@Injectable()
export class NestAuthenticateUseCase extends AuthenticateUseCase {
  constructor(
    adminsRepository: PrismaAdminsRepository,
    hashCompare: BcryptHasher,
    encrypter: JwtEncrypter,
  ) {
    super(adminsRepository, hashCompare, encrypter)
  }
}
