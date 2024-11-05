import { Injectable } from '@nestjs/common'

import { PrismaUsersRepository } from '@/infra/database/prisma/admin/repositories/prisma-users.repository'
import { PrismaAdminsRepository } from '@/infra/database/prisma/admin/repositories/prisma-admins.repository'

import { AssignAdminUseCase } from '@/domain/admin/use-cases/assign-admin.use-case'

@Injectable()
export class NestAssignAdminUseCase extends AssignAdminUseCase {
  constructor(
    usersRepository: PrismaUsersRepository,
    adminsRepository: PrismaAdminsRepository,
  ) {
    super(usersRepository, adminsRepository)
  }
}
