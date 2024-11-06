import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { PrismaUsersRepository } from './repositories/prisma-users.repository'
import { PrismaAdminsRepository } from './repositories/prisma-admins.repository'
import { PrismaCustomersRepository } from './repositories/prisma-customers.repository'
import { PrismaDeliveryWorkersRepository } from './repositories/prisma-delivery-workers.repository'

@Module({
  providers: [
    PrismaService,
    PrismaUsersRepository,
    PrismaAdminsRepository,
    PrismaCustomersRepository,
    PrismaDeliveryWorkersRepository,
  ],
  exports: [
    PrismaService,
    PrismaUsersRepository,
    PrismaAdminsRepository,
    PrismaCustomersRepository,
    PrismaDeliveryWorkersRepository,
  ],
})
export class AdminDatabaseModule {}
