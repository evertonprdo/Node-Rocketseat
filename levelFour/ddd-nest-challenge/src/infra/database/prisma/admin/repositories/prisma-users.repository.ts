import { Injectable } from '@nestjs/common'

import { User } from '@/domain/admin/entities/user'
import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'
import { UsersRepository } from '@/domain/admin/repositories/users.repository'

import { PrismaService } from '../../prisma.service'
import { PrismaUserMapper } from '../mappers/prisma-user.mapper'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    throw new Error('Method not implemented.')
  }

  async findByCPF(cpf: string) {
    throw new Error('Method not implemented.')
  }

  async findMany(params: PaginationParams) {
    throw new Error('Method not implemented.')
  }

  async create(user: User) {
    const data = PrismaUserMapper.toPrisma(user)
    await this.prisma.user.create({ data })
  }

  async save(user: User) {
    throw new Error('Method not implemented.')
  }

  async delete(user: User) {
    throw new Error('Method not implemented.')
  }
}
