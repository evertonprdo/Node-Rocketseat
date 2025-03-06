import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../prisma.service'

import { DeliveryWorkersRepository } from '@/domain/delivery/repositories/delivery-workers.repository'
import { PrismaDeliveryWorkerMapper } from '../mappers/prisma-delivery-worker.mapper'

@Injectable()
export class PrismaDeliveryWorkersRepository
  implements DeliveryWorkersRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const deliveryWorker = await this.prisma.deliveryWorker.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    if (!deliveryWorker) {
      return null
    }

    return PrismaDeliveryWorkerMapper.toDomain(deliveryWorker)
  }
}
