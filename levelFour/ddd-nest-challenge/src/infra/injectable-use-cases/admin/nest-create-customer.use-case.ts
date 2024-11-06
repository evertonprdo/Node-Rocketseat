import { Injectable } from '@nestjs/common'

import { CreateCustomerUseCase } from '@/domain/admin/use-cases/create-customer.use-case'
import { PrismaCustomersRepository } from '@/infra/database/prisma/admin/repositories/prisma-customers.repository'

@Injectable()
export class NestCreateCustomerUseCase extends CreateCustomerUseCase {
  constructor(customersRepository: PrismaCustomersRepository) {
    super(customersRepository)
  }
}
