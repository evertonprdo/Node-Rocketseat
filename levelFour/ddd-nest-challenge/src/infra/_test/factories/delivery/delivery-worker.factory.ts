import { Injectable } from '@nestjs/common'

import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { makeCPF } from '@/domain/_shared/_tests/factories/make-cpf'
import { makeDeliveryWorker } from '@/domain/delivery/_tests/factories/make-delivery-worker'

import {
  DeliveryWorker,
  DeliveryWorkerProps,
} from '@/domain/delivery/entities/delivery-worker'

import { Prisma } from '@prisma/client'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

@Injectable()
export class DeliveryWorkerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryWorker(
    data: Partial<DeliveryWorkerProps> = {},
  ): Promise<DeliveryWorker> {
    const prismaUser: Prisma.UserUncheckedCreateInput = {
      id: new UniqueEntityId().toString(),
      cpf: makeCPF(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
    }

    await this.prisma.user.create({
      data: prismaUser,
    })

    const deliveryWorker = makeDeliveryWorker(data)

    const prismaDeliveryWorker: Prisma.DeliveryWorkerUncheckedCreateInput = {
      id: deliveryWorker.id.toString(),
      userId: prismaUser.id as string,
      operationZone: deliveryWorker.operationCity,
    }

    await this.prisma.deliveryWorker.create({
      data: prismaDeliveryWorker,
    })

    return deliveryWorker
  }
}
