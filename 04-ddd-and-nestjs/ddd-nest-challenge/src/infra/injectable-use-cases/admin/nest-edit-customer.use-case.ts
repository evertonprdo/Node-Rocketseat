import { Injectable } from '@nestjs/common'

import { EditCustomerUseCase } from '@/domain/admin/use-cases/edit-customer.use-case'

import { PrismaCustomersRepository } from '@/infra/database/prisma/admin/repositories/prisma-customers.repository'

@Injectable()
export class NestEditCustomerUseCase extends EditCustomerUseCase {
  constructor(customersRepository: PrismaCustomersRepository) {
    super(customersRepository)
  }
}
