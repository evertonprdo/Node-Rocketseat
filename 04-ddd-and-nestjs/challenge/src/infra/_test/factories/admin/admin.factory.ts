import { Injectable } from '@nestjs/common'

import { makeAdmin } from '@/domain/admin/_tests/factories/make-admin'
import { Admin, AdminProps } from '@/domain/admin/entities/admin'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAdminMapper } from '@/infra/database/prisma/admin/mappers/prisma-admin.mapper'

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data)

    await this.prisma.admin.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return admin
  }
}
