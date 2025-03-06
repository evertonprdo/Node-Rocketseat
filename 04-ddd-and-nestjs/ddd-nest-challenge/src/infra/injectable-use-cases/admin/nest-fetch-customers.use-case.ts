import { Injectable } from '@nestjs/common'

import { FetchCustomersUseCase } from '@/domain/admin/use-cases/fetch-customers.use-case'

import { PrismaCustomersRepository } from '@/infra/database/prisma/admin/repositories/prisma-customers.repository'

@Injectable()
export class NestFetchCustomersUseCase extends FetchCustomersUseCase {
  constructor(customersRepository: PrismaCustomersRepository) {
    super(customersRepository)
  }
}
