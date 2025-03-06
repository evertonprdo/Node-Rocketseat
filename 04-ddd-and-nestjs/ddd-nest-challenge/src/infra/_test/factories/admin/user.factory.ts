import { Injectable } from '@nestjs/common'

import { makeUser } from '@/domain/admin/_tests/factories/make-user'
import { User, UserProps } from '@/domain/admin/entities/user'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaUserMapper } from '@/infra/database/prisma/admin/mappers/prisma-user.mapper'

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })

    return user
  }
}
