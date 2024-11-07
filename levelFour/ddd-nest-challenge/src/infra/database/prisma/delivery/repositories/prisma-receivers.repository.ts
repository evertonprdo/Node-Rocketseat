import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../prisma.service'
import { PrismaReceiverMapper } from '../mappers/prisma-receiver.mapper'

import { ReceiversRepository } from '@/domain/delivery/repositories/receivers.repository'

@Injectable()
export class PrismaReceiversRepository implements ReceiversRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const receiver = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    })

    if (!receiver) {
      return null
    }

    console.log(receiver)
    return PrismaReceiverMapper.toDomain(receiver)
  }
}
