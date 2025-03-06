import { Injectable } from '@nestjs/common'

import { PrismaUsersRepository } from '@/infra/database/prisma/admin/repositories/prisma-users.repository'
import { PrismaCustomersRepository } from '@/infra/database/prisma/admin/repositories/prisma-customers.repository'

import { AssignCustomerUseCase } from '@/domain/admin/use-cases/assign-customer.use-case'

@Injectable()
export class NestAssignCustomerUseCase extends AssignCustomerUseCase {
  constructor(
    customersRepository: PrismaCustomersRepository,
    usersRepository: PrismaUsersRepository,
  ) {
    super(customersRepository, usersRepository)
  }
}
