import { Attachment } from '../entities/attachment'

export interface AttachmentsRepository {
  create(attachment: Attachment): Promise<void>
}
