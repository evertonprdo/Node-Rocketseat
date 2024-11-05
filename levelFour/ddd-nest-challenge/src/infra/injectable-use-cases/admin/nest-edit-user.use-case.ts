import { Injectable } from '@nestjs/common'

import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaUsersRepository } from '@/infra/database/prisma/admin/repositories/prisma-users.repository'

import { EditUserUseCase } from '@/domain/admin/use-cases/edit-user.use-case'

@Injectable()
export class NestEditUserUseCase extends EditUserUseCase {
  constructor(
    usersRepository: PrismaUsersRepository,
    hashGenerator: BcryptHasher,
  ) {
    super(usersRepository, hashGenerator)
  }
}
