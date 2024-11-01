import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeliveryAttachmentProps } from '@/domain/_shared/entities/types/delivery-attachment'

export class DeliveryAttachment extends Entity<DeliveryAttachmentProps> {
  get deliveryId() {
    return this.props.deliveryId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: DeliveryAttachmentProps, id?: UniqueEntityId) {
    const deliveryAttachment = new DeliveryAttachment(props, id)

    return deliveryAttachment
  }
}