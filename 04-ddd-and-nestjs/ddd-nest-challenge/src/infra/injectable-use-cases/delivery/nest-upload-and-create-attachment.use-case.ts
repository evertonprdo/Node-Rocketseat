import { Injectable } from '@nestjs/common'

import { R2Storage } from '@/infra/storage/r2-storage'
import { PrismaAttachmentsRepository } from '@/infra/database/prisma/delivery/repositories/prisma-attachments.repository'

import { UploadAndCreateAttachmentUseCase } from '@/domain/delivery/use-cases/upload-and-create-attachments'

@Injectable()
export class NestUploadAndCreateAttachmentUseCase extends UploadAndCreateAttachmentUseCase {
  constructor(
    attachmentsRepository: PrismaAttachmentsRepository,
    uploader: R2Storage,
  ) {
    super(attachmentsRepository, uploader)
  }
}
