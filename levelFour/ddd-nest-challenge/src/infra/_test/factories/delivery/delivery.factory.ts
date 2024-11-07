import { Injectable } from '@nestjs/common'

import { DeliveryProps } from '@/domain/delivery/entities/delivery'
import { makeDelivery } from '@/domain/delivery/_tests/factories/make-delivery'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaDeliveryMapper } from '@/infra/database/prisma/delivery/mappers/prisma-delivery.mapper'

@Injectable()
export class DeliveryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDelivery(data: Partial<DeliveryProps> = {}) {
    const delivery = makeDelivery(data)

    await this.prisma.delivery.create({
      data: PrismaDeliveryMapper.toPrisma(delivery),
    })

    return delivery
  }
}