import { Attachment } from '@/core/entities/attachment'
import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface DeliveryWithCostumerProps {
  costumerId: UniqueEntityId
  name: string
  status: string
  courierId?: UniqueEntityId | null
  createdAt: Date
  pickupDate?: Date | null
  deliveredAt?: Date | null
  deliveryAttachment?: Attachment
  updatedAt?: Date | null
}

export class DeliveryWithCostumer extends ValueObject<DeliveryWithCostumerProps> {
  get costumerId() {
    return this.props.costumerId
  }

  get name() {
    return this.props.name
  }

  get status() {
    return this.props.status
  }

  get courierId() {
    return this.props.courierId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get pickupDate() {
    return this.props.pickupDate
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  get deliveryAttachment() {
    return this.props.deliveryAttachment
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: DeliveryWithCostumerProps) {
    return new DeliveryWithCostumer(props)
  }
}
