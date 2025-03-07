import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'

import { Delivery } from '@/domain/admin/entities/delivery'
import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'

import { PrismaService } from '../../prisma.service'
import { PrismaDeliveryMapper } from '../mappers/prisma-delivery.mapper'

import { DeliveriesRepository } from '@/domain/admin/repositories/deliveries.repository'
import { PrismaDeliveryDetailsMapper } from '../mappers/prisma-delivery-details.mapper'

@Injectable()
export class PrismaDeliveriesRepository implements DeliveriesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: {
        id,
      },
    })

    if (!delivery) {
      return null
    }

    return PrismaDeliveryMapper.toDomain(delivery)
  }

  async findDetailsById(id: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: {
        id,
      },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        deliveryWorker: {
          include: {
            user: true,
          },
        },
        attachment: true,
      },
    })

    if (!delivery) {
      return null
    }

    return PrismaDeliveryDetailsMapper.toDomain(delivery)
  }

  async findMany({ page }: PaginationParams) {
    const take = 20

    const deliveries = await this.prisma.delivery.findMany({
      take,
      skip: (page - 1) * take,
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async create(delivery: Delivery) {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }

  async delete(delivery: Delivery) {
    await this.prisma.delivery.delete({
      where: {
        id: delivery.id.toString(),
      },
    })
  }
}
