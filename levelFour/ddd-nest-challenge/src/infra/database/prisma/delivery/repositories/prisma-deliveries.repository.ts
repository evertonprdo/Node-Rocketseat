import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'

import { Delivery } from '@/domain/delivery/entities/delivery'
import {
  DeliveriesRepository,
  FindManyPendingByCity,
  findManyDeliveredByDeliveryWorkerId,
} from '@/domain/delivery/repositories/deliveries.repository'

import { PrismaService } from '../../prisma.service'
import { PrismaDeliveryMapper } from '../mappers/prisma-delivery.mapper'
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
            user: {
              select: { name: true },
            },
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

  async findManyDeliveredByDeliveryWorkerId({
    page,
    deliveryWorkerId,
  }: findManyDeliveredByDeliveryWorkerId) {
    const take = 20

    const deliveries = await this.prisma.delivery.findMany({
      where: {
        deliveryWorkerId,
        status: 'DELIVERED',
      },
      take,
      skip: (page - 1) * take,
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async findManyPickedUpByDeliveryWorkerId(
    deliveryWorkerId: string,
  ): Promise<Delivery[]> {
    const deliveries = await this.prisma.delivery.findMany({
      where: {
        deliveryWorkerId,
        status: 'PICKED_UP',
      },
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async findManyPendingByCity({ city, page }: FindManyPendingByCity) {
    const take = 20

    const deliveries = await this.prisma.delivery.findMany({
      where: {
        customer: {
          city,
        },
      },
      take,
      skip: (page - 1) * take,
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async save(delivery: Delivery) {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.update({
      where: {
        id: delivery.id.toString(),
      },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }
}
