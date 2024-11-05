import { Injectable } from '@nestjs/common'

import { FetchUsersUseCase } from '@/domain/admin/use-cases/fetch-users.use-case'
import { PrismaUsersRepository } from '@/infra/database/prisma/admin/repositories/prisma-users.repository'

@Injectable()
export class NestFetchUsersUseCase extends FetchUsersUseCase {
  constructor(usersRepository: PrismaUsersRepository) {
    super(usersRepository)
  }
}
