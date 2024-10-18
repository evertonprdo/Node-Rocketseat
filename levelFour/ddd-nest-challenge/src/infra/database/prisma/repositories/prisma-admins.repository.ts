import { AdminsRepository } from '@/domain/delivery/repositories/admins.repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Admin } from '@/domain/delivery/entities/admin'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async findByCPF(cpf: string) {
    const admin = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async create(admin: Admin) {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.create({
      data,
    })
  }
}
