import { Injectable } from '@nestjs/common'

import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'

import { AuthenticateUseCase } from '@/domain/authentication/use-cases/authenticate.use-case'

import { PrismaUsersRepository } from '@/infra/database/prisma/authentication/repositories/prisma-users.repository'

@Injectable()
export class NestAuthenticateUseCase extends AuthenticateUseCase {
  constructor(
    usersRepository: PrismaUsersRepository,
    hashCompare: BcryptHasher,
    encrypter: JwtEncrypter,
  ) {
    super(usersRepository, hashCompare, encrypter)
  }
}
