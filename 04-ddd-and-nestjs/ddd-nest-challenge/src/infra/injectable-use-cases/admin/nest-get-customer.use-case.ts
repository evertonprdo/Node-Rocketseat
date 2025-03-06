import { Injectable } from '@nestjs/common'

import { GetCustomerUseCase } from '@/domain/admin/use-cases/get-customer.use-case'
import { PrismaCustomersRepository } from '@/infra/database/prisma/admin/repositories/prisma-customers.repository'

@Injectable()
export class NestGetCustomerUseCase extends GetCustomerUseCase {
  constructor(customersRepository: PrismaCustomersRepository) {
    super(customersRepository)
  }
}
