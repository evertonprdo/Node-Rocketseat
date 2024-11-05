import { Injectable } from '@nestjs/common'

import { PrismaAdminsRepository } from '@/infra/database/prisma/admin/repositories/prisma-admins.repository'

import { GetAdminUseCase } from '@/domain/admin/use-cases/get-admin.use-case'

@Injectable()
export class NestGetAdminUseCase extends GetAdminUseCase {
  constructor(adminsRepository: PrismaAdminsRepository) {
    super(adminsRepository)
  }
}
