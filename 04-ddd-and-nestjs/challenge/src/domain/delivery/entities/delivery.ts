import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { StatusKeys } from '@/domain/_shared/entities/types/delivery'
import { DeliveryAttachment } from '@/domain/_shared/entities/value-objects/delivery-attachment'

import { DeliveryStatusUpdatedEvent } from '../events/delivery-status-updated.event'

const StatusMap = {
  PENDING: 'Pending',
  PICKED_UP: 'Picked up',
  DELIVERED: 'Delivered',
  RETURNED: 'Returned',
}

export interface DeliveryProps {
  receiverId: UniqueEntityId
  status: StatusKeys
  deliveryWorkerId?: UniqueEntityId | null
  createdAt: Date
  pickedUpAt?: Date | null
  deliveredAt?: Date | null
  attachment?: DeliveryAttachment | null
  updatedAt?: Date | null
}

export class Delivery extends AggregateRoot<DeliveryProps> {
  get receiverId() {
    return this.props.receiverId
  }

  get deliveryWorkerId() {
    return this.props.deliveryWorkerId
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

  get updatedAt() {
    return this.props.updatedAt
  }

  get status() {
    return this.props.status
  }

  get attachment() {
    return this.props.attachment
  }

  getStatusName() {
    return StatusMap[this.status]
  }

  markAsPickedUp(deliveryWorkerId: UniqueEntityId) {
    this.props.status = 'PICKED_UP'
    this.props.pickedUpAt = new Date()
    this.props.deliveryWorkerId = deliveryWorkerId

    this.addDomainEvent(new DeliveryStatusUpdatedEvent(this))

    this.touch()
  }

  markAsDelivered(attachment: DeliveryAttachment) {
    this.props.status = 'DELIVERED'
    this.props.deliveredAt = new Date()
    this.props.attachment = attachment

    this.addDomainEvent(new DeliveryStatusUpdatedEvent(this))

    this.touch()
  }

  markAsReturned() {
    this.props.status = 'RETURNED'

    this.addDomainEvent(new DeliveryStatusUpdatedEvent(this))

    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: DeliveryProps, id: UniqueEntityId) {
    const delivery = new Delivery(props, id)

    return delivery
  }
}
