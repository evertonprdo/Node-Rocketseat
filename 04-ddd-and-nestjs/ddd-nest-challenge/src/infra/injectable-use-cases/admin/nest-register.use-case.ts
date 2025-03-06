import { Injectable } from '@nestjs/common'

import { RegisterUseCase } from '@/domain/admin/use-cases/register.use-case'

import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaUsersRepository } from '@/infra/database/prisma/admin/repositories/prisma-users.repository'

@Injectable()
export class NestRegisterUseCase extends RegisterUseCase {
  constructor(
    usersRepository: PrismaUsersRepository,
    hashCompare: BcryptHasher,
  ) {
    super(usersRepository, hashCompare)
  }
}
