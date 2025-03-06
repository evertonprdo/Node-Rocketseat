import { Injectable } from '@nestjs/common'

import { DeliveryWorker } from '@/domain/admin/entities/delivery-worker'
import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'

import { PrismaService } from '../../prisma.service'
import { PrismaDeliveryWorkerMapper } from '../mappers/prisma-delivery-worker.mapper'
import { PrismaDeliveryWorkerDetailsMapper } from '../mappers/prisma-delivery-worker-details.mapper'

import { DeliveryWorkersRepository } from '@/domain/admin/repositories/delivery-workers.repository'

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
    })

    if (!deliveryWorker) {
      return null
    }

    return PrismaDeliveryWorkerMapper.toDomain(deliveryWorker)
  }

  async findDetailsById(id: string) {
    const deliveryWorker = await this.prisma.deliveryWorker.findUnique({
      where: {
        id,
      },
      include: { user: true },
    })

    if (!deliveryWorker) {
      return null
    }

    return PrismaDeliveryWorkerDetailsMapper.toDomain(deliveryWorker)
  }

  async findManyDetails({ page }: PaginationParams) {
    const take = 20

    const deliveryWorkers = await this.prisma.deliveryWorker.findMany({
      take,
      skip: (page - 1) * take,
      include: { user: true },
    })

    return deliveryWorkers.map(PrismaDeliveryWorkerDetailsMapper.toDomain)
  }

  async findByUserId(userId: string) {
    const deliveryWorker = await this.prisma.deliveryWorker.findUnique({
      where: {
        userId,
      },
    })

    if (!deliveryWorker) {
      return null
    }

    return PrismaDeliveryWorkerMapper.toDomain(deliveryWorker)
  }

  async assign(deliveryWorker: DeliveryWorker) {
    const data = PrismaDeliveryWorkerMapper.toPrisma(deliveryWorker)

    await this.prisma.deliveryWorker.create({
      data,
    })
  }

  async save(deliveryWorker: DeliveryWorker) {
    const data = PrismaDeliveryWorkerMapper.toPrisma(deliveryWorker)

    await this.prisma.deliveryWorker.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async unassign(deliveryWorker: DeliveryWorker) {
    await this.prisma.deliveryWorker.delete({
      where: {
        id: deliveryWorker.id.toString(),
      },
    })
  }
}
