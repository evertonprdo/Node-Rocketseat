import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import {
  DeliveryProps,
  StatusKeys,
} from '@/domain/_shared/entities/types/delivery'

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

  set status(key: StatusKeys) {
    this.props.status = key
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
      // delivery.addDomainEvent(new DeliveryStatusUpdatedEvent(delivery))
    }

    return delivery
  }
}
