import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { PrismaUsersRepository } from './repositories/prisma-users.repository'
import { PrismaAdminsRepository } from './repositories/prisma-admins.repository'

@Module({
  providers: [PrismaService, PrismaUsersRepository, PrismaAdminsRepository],
  exports: [PrismaService, PrismaUsersRepository, PrismaAdminsRepository],
})
export class AdminDatabaseModule {}
