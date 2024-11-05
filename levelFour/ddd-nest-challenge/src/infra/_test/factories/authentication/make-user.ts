import { Injectable } from '@nestjs/common'

import { faker } from '@faker-js/faker'

import { makeUser } from '@/domain/authentication/_tests/factories/make-user'

import { User, UserProps } from '@/domain/authentication/entities/user'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: {
        cpf: user.cpf.value,
        password: user.password,
        name: faker.person.fullName(),
        phone: faker.phone.number(),
      },
    })

    return user
  }
}
