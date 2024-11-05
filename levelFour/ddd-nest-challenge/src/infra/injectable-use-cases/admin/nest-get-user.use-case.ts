import { Injectable } from '@nestjs/common'

import { GetUserUseCase } from '@/domain/admin/use-cases/get-user.use-case'
import { PrismaUsersRepository } from '@/infra/database/prisma/admin/repositories/prisma-users.repository'

@Injectable()
export class NestGetUserUseCase extends GetUserUseCase {
  constructor(usersRepository: PrismaUsersRepository) {
    super(usersRepository)
  }
}
