import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { PrismaUsersRepository } from './repositories/prisma-users.repository'

@Module({
  providers: [PrismaService, PrismaUsersRepository],
  exports: [PrismaService, PrismaUsersRepository],
})
export class AdminDatabaseModule {}
