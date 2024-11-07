import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { StatusKeys } from '@/domain/_shared/entities/types/delivery'
import { Address } from '@/domain/_shared/entities/value-objects/address'
import { DeliveryAttachment } from '@/domain/_shared/entities/delivery-attachment'

export interface DeliveryDetailsProps {
  deliveryId: UniqueEntityId
  status: StatusKeys
  createdAt: Date
  pickedUpAt?: Date | null
  deliveredAt?: Date | null
  attachment?: DeliveryAttachment | null
  updatedAt?: Date | null

  receiver: {
    id: UniqueEntityId
    name: string
    address: Address
  }
}

export class DeliveryDetails extends ValueObject<DeliveryDetailsProps> {
  get deliveryId() {
    return this.props.deliveryId
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get pickedUpAt() {
    return this.props.pickedUpAt
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  get attachment() {
    return this.props.attachment
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get receiver() {
    return this.props.receiver
  }

  static create(props: DeliveryDetailsProps) {
    return new DeliveryDetails(props)
  }
}
