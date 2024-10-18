import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import {
  DeliveryAttachment,
  DeliveryAttachmentProps,
} from '@/domain/delivery/entities/delivery-attachment'

export function makeDeliveryAttachment(
  overwrite: Partial<DeliveryAttachmentProps> = {},
  id?: UniqueEntityId,
) {
  const deliveryAttachment = DeliveryAttachment.create(
    {
      deliveryId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...overwrite,
    },
    id,
  )

  return deliveryAttachment
}
