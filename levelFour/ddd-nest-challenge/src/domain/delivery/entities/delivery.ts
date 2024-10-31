import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { DeliveryAttachment } from '../../_shared/entities/delivery-attachment'
import { DeliveryStatusUpdatedEvent } from '../events/delivery-status-updated.event'
import { DeliveryProps } from '@/domain/_shared/entities/types/delivery'

const StatusMap = {
  PENDING: 'Pending',
  PICKED_UP: 'Picked up',
  DELIVERED: 'Delivered',
  RETURNED: 'Returned',
}

export class Delivery extends AggregateRoot<DeliveryProps> {
  get customerId() {
    return this.props.customerId
  }

  get deliveryWorkerId() {
    return this.props.deliveryWorkerId
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

  markAsPickedUp(deliveryWorkerId: UniqueEntityId) {
    this.props.status = 'PICKED_UP'
    this.props.pickedUpDate = new Date()
    this.props.deliveryWorkerId = deliveryWorkerId

    this.addDomainEvent(new DeliveryStatusUpdatedEvent(this))

    this.touch()
  }

  markAsDelivered(attachment: DeliveryAttachment) {
    this.props.status = 'DELIVERED'
    this.props.deliveredAt = new Date()
    this.props.deliveryAttachment = attachment

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

  static create(
    props: Optional<DeliveryProps, 'deliveryWorkerId' | 'createdAt' | 'status'>,
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

    const isNewDelivery = !id

    if (isNewDelivery) {
      delivery.addDomainEvent(new DeliveryStatusUpdatedEvent(delivery))
    }

    return delivery
  }
}
