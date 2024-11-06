import { Injectable } from '@nestjs/common'

import { Customer } from '@/domain/admin/entities/customer'
import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'
import { CustomersRepository } from '@/domain/admin/repositories/customers.repository'

import { PrismaService } from '../../prisma.service'
import { PrismaCustomerMapper } from '../mappers/prisma-customer.mapper'

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        email,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async findById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async findMany({ page }: PaginationParams) {
    const take = 20

    const customers = await this.prisma.customer.findMany({
      take,
      skip: (page - 1) * take,
    })

    return customers.map(PrismaCustomerMapper.toDomain)
  }

  async create(customer: Customer) {
    const data = PrismaCustomerMapper.toPrisma(customer)

    await this.prisma.customer.create({
      data,
    })
  }

  async save(customer: Customer) {
    const data = PrismaCustomerMapper.toPrisma(customer)

    await this.prisma.customer.update({
      where: {
        id: customer.id.toString(),
      },
      data,
    })
  }

  async delete(customer: Customer) {
    await this.prisma.customer.delete({
      where: {
        id: customer.id.toString(),
      },
    })
  }
}
