import { Injectable } from '@nestjs/common'

import { DeleteCustomerUseCase } from '@/domain/admin/use-cases/delete-customer.use-case'

import { PrismaCustomersRepository } from '@/infra/database/prisma/admin/repositories/prisma-customers.repository'

@Injectable()
export class NestDeleteCustomerUseCase extends DeleteCustomerUseCase {
  constructor(customersRepository: PrismaCustomersRepository) {
    super(customersRepository)
  }
}
