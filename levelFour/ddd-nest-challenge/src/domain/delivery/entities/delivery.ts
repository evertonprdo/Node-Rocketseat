import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

import { Attachment } from '@/core/entities/attachment'
import { Optional } from '@/core/types/optional'

const StatusMap = {
  PENDING: 'Pending',
  PICKED_UP: 'Picked up',
  DELIVERED: 'Delivered',
  RETURNED: 'Returned',
}

type StatusKeys = keyof typeof StatusMap

export interface DeliveryProps {
  customerId: UniqueEntityId
  status: StatusKeys
  courierId?: UniqueEntityId
  createdAt: Date
  pickupDate?: Date
  deliveredAt?: Date
  deliveryAttachment?: Attachment
  updatedAt?: Date
}

export class Delivery extends Entity<DeliveryProps> {
  get customerId() {
    return this.props.customerId
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

  get updatedAt() {
    return this.props.updatedAt
  }

  get status() {
    return this.props.status
  }

  set courierId(courierId: UniqueEntityId) {
    this.props.courierId = courierId
  }

  getStatusName() {
    return StatusMap[this.status]
  }

  markAsPickedUp() {
    this.props.status = 'PICKED_UP'
    this.props.pickupDate = new Date()

    this.touch()
  }

  markAsDelivered() {
    this.props.status = 'DELIVERED'
    this.props.deliveredAt = new Date()

    this.touch()
  }

  markAsReturned() {
    this.props.status = 'RETURNED'

    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DeliveryProps, 'courierId' | 'createdAt' | 'status'>,
    id?: UniqueEntityId,
  ) {
    const delivery = new Delivery(
      {
        ...props,
        status: props.status ?? 'PENDING',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return delivery
  }
}
