import { Injectable } from '@nestjs/common'

import { Admin } from '@/domain/admin/entities/admin'
import { AdminsRepository } from '@/domain/admin/repositories/admins.repository'

import { PrismaService } from '../../prisma.service'

import { PrismaAdminMapper } from '../mappers/prisma-admin.mapper'
import { PrismaAdminDetailsMapper } from '../mappers/prisma-admin-details.mapper'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findDetailsById(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id,
      },
      include: { user: true },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminDetailsMapper.toDomain(admin)
  }

  async findByEmail(email: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        email,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findByUserId(userId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        userId,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async assign(admin: Admin) {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.admin.create({
      data,
    })
  }

  async save(admin: Admin) {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.admin.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async unassign(admin: Admin) {
    await this.prisma.admin.delete({
      where: {
        id: admin.id.toString(),
      },
    })
  }
}
