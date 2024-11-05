import { Injectable } from '@nestjs/common'

import { PrismaUsersRepository } from '@/infra/database/prisma/admin/repositories/prisma-users.repository'
import { DeleteUserUseCase } from '@/domain/admin/use-cases/delete-user.use-case'

@Injectable()
export class NestDeleteUserUseCase extends DeleteUserUseCase {
  constructor(usersRepository: PrismaUsersRepository) {
    super(usersRepository)
  }
}
