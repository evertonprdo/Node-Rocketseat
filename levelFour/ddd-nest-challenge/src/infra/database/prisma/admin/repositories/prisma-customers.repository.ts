import { Injectable } from '@nestjs/common'

import { Customer } from '@/domain/admin/entities/customer'
import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'
import { CustomersRepository } from '@/domain/admin/repositories/customers.repository'

import { PrismaService } from '../../prisma.service'
import { CustomerDetails } from '@/domain/admin/entities/values-objects/customer-details'

import { PrismaCustomerMapper } from '../mappers/prisma-customer.mapper'
import { PrismaCustomerDetailsMapper } from '../mappers/prisma-customer-details.mapper'

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

  async findDetailsById(id: string): Promise<CustomerDetails | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerDetailsMapper.toDomain(customer)
  }

  async findByUserId(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        userId: id,
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
