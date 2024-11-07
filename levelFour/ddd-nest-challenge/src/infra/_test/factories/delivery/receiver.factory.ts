import { Injectable } from '@nestjs/common'

import { faker } from '@faker-js/faker'

import { makeReceiver } from '@/domain/delivery/_tests/factories/make-receiver'
import { ReceiverProps } from '@/domain/delivery/entities/receiver'

import { Prisma } from '@prisma/client'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

@Injectable()
export class ReceiverFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaReceiver(data: Partial<ReceiverProps> = {}) {
    const receiver = makeReceiver(data)

    const prismaReceiver: Prisma.CustomerUncheckedCreateInput = {
      id: receiver.id.toString(),
      email: faker.internet.email(),
      name: receiver.name,
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
