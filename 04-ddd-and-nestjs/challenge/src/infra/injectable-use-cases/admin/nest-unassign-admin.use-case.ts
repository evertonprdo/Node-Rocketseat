import { Injectable } from '@nestjs/common'

import { UnassignAdminUseCase } from '@/domain/admin/use-cases/unassign-admin.use-case'
import { PrismaAdminsRepository } from '@/infra/database/prisma/admin/repositories/prisma-admins.repository'

@Injectable()
export class NestUnassignAdminUseCase extends UnassignAdminUseCase {
  constructor(adminsRepository: PrismaAdminsRepository) {
    super(adminsRepository)
  }
}
