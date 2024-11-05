import { Injectable } from '@nestjs/common'

import { User } from '@/domain/admin/entities/user'
import { UsersRepository } from '@/domain/admin/repositories/users.repository'
import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'

import { PrismaService } from '../../prisma.service'
import { PrismaUserMapper } from '../mappers/prisma-user.mapper'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByCPF(cpf: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findMany({ page }: PaginationParams) {
    const take = 20
    const users = await this.prisma.user.findMany({
      take,
      skip: (page - 1) * take,
    })

    return users.map(PrismaUserMapper.toDomain)
  }

  async create(user: User) {
    const data = PrismaUserMapper.toPrisma(user)
    await this.prisma.user.create({ data })
  }

  async save(user: User) {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(user: User) {
    await this.prisma.admin.delete({
      where: {
        id: user.id.toString(),
      },
    })
  }
}
