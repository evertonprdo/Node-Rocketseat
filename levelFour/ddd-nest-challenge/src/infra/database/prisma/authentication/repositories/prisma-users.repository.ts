import { Injectable } from '@nestjs/common'

import { UsersRepository } from '@/domain/authentication/repositories/users.repository'

import { PrismaService } from '../../prisma.service'
import { PrismaUserMapper } from '../mappers/prisma-user.mapper'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByCPF(cpf: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
      include: { admin: true, deliveryWorker: true },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }
}
