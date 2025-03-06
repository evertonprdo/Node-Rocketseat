import { Injectable } from '@nestjs/common'

import { CustomerProps } from '@/domain/admin/entities/customer'
import { makeCustomer } from '@/domain/admin/_tests/factories/make-customer'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaCustomerMapper } from '@/infra/database/prisma/admin/mappers/prisma-customer.mapper'

@Injectable()
export class CustomerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCustomer(data: Partial<CustomerProps> = {}) {
    const customer = makeCustomer(data)

    await this.prisma.customer.create({
      data: PrismaCustomerMapper.toPrisma(customer),
    })

    return customer
  }
}
