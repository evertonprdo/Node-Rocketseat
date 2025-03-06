import { Injectable } from '@nestjs/common'

import { EditAdminUseCase } from '@/domain/admin/use-cases/edit-admin.use-case'
import { PrismaAdminsRepository } from '@/infra/database/prisma/admin/repositories/prisma-admins.repository'

@Injectable()
export class NestEditAdminUseCase extends EditAdminUseCase {
  constructor(adminsRepository: PrismaAdminsRepository) {
    super(adminsRepository)
  }
}
