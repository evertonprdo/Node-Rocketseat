import { Injectable } from '@nestjs/common'

import { makeDeliveryWorker } from '@/domain/admin/_tests/factories/make-delivery-worker'
import {
  DeliveryWorker,
  DeliveryWorkerProps,
} from '@/domain/admin/entities/delivery-worker'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaDeliveryWorkerMapper } from '@/infra/database/prisma/admin/mappers/prisma-delivery-worker.mapper'

@Injectable()
export class DeliveryWorkerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryWorker(
    data: Partial<DeliveryWorkerProps> = {},
  ): Promise<DeliveryWorker> {
    const deliveryWorker = makeDeliveryWorker(data)

    await this.prisma.deliveryWorker.create({
      data: PrismaDeliveryWorkerMapper.toPrisma(deliveryWorker),
    })

    return deliveryWorker
  }
}
