import { Injectable } from '@nestjs/common'

import { faker } from '@faker-js/faker'

import { makeReceiver } from '@/domain/delivery/_tests/factories/make-receiver'
import { ReceiverProps } from '@/domain/delivery/entities/receiver'

import { Prisma } from '@prisma/client'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { makeUser } from '@/domain/admin/_tests/factories/make-user'
import { PrismaUserMapper } from '@/infra/database/prisma/admin/mappers/prisma-user.mapper'

@Injectable()
export class ReceiverFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaReceiver(data: Partial<ReceiverProps> = {}) {
    const receiver = makeReceiver(data)
    const user = makeUser()

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })

    const prismaReceiver: Prisma.CustomerUncheckedCreateInput = {
      userId: user.id.toString(),
      id: receiver.id.toString(),
      email: faker.internet.email(),
      cep: receiver.address.cep.value,
      state: receiver.address.state,
      city: receiver.address.city,
      street: receiver.address.street,
      number: receiver.address.number,
      neighborhood: receiver.address.neighborhood,
    }

    await this.prisma.customer.create({
      data: prismaReceiver,
    })

    return receiver
  }
}
