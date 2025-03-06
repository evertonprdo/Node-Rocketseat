import { randomUUID } from 'node:crypto'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Attachment, AttachmentProps } from '../../entities/attachment'

export function makeAttachment(
  overwrite: Partial<AttachmentProps> = {},
  id?: UniqueEntityId,
) {
  const attachment = Attachment.create(
    {
      title: randomUUID(),
      url: randomUUID(),
      ...overwrite,
    },
    id,
  )

  return attachment
}
