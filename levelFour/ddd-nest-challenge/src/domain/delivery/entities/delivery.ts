import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { DeliveryAttachment } from './delivery-attachment'

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
  pickedUpDate?: Date
  deliveredAt?: Date
  deliveryAttachment?: DeliveryAttachment
  updatedAt?: Date
}

export class Delivery extends AggregateRoot<DeliveryProps> {
  get customerId() {
    return this.props.customerId
  }

  get courierId() {
    return this.props.courierId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get pickedUpDate() {
    return this.props.pickedUpDate
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

  get deliveryAttachment() {
    return this.props.deliveryAttachment
  }

  getStatusName() {
    return StatusMap[this.status]
  }

  markAsPickedUp(courierId: UniqueEntityId) {
    this.props.status = 'PICKED_UP'
    this.props.pickedUpDate = new Date()
    this.props.courierId = courierId

    this.touch()
  }

  markAsDelivered(attachment: DeliveryAttachment) {
    this.props.status = 'DELIVERED'
    this.props.deliveredAt = new Date()
    this.props.deliveryAttachment = attachment

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
