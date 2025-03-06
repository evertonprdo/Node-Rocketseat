import { Injectable } from '@nestjs/common'

import { AttachmentProps } from '@/domain/_shared/entities/attachment'
import { makeAttachment } from '@/domain/_shared/_tests/factories/make-attachment'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/delivery/mappers/prisma-attachment.mapper'

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(overwrite: Partial<AttachmentProps> = {}) {
    const attachment = makeAttachment(overwrite)

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })

    return attachment
  }
}
