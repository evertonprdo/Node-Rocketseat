import { Attachment } from '../../entities/attachment'
import { AttachmentsRepository } from '../../repositories/attachments.repository'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}
