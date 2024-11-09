import { Injectable } from '@nestjs/common'

import { UnassignCustomerUseCase } from '@/domain/admin/use-cases/unassign-customer.use-case'

import { PrismaCustomersRepository } from '@/infra/database/prisma/admin/repositories/prisma-customers.repository'

@Injectable()
export class NestUnassignCustomerUseCase extends UnassignCustomerUseCase {
  constructor(customersRepository: PrismaCustomersRepository) {
    super(customersRepository)
  }
}
