import { ValueObject } from '@/core/entities/value-object'

import { DeliveryAttachmentProps } from '@/domain/_shared/entities/types/delivery-attachment'

export class DeliveryAttachment extends ValueObject<DeliveryAttachmentProps> {
  get deliveryId() {
    return this.props.deliveryId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: DeliveryAttachmentProps) {
    const deliveryAttachment = new DeliveryAttachment(props)

    return deliveryAttachment
  }
}
