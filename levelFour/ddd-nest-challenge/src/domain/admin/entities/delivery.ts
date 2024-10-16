import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

const StatusMap = {
  PENDING: 'Pending',
  PICKED_UP: 'Picked up',
  DELIVERED: 'Delivered',
  RETURNED: 'Returned',
}

interface DeliveryProps {
  customerId: UniqueEntityId
  courierId: UniqueEntityId
  status?: keyof typeof StatusMap
  createdAt?: Date
  pickupDate?: Date
  deliveredAt?: Date
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
    return StatusMap[this.props.status]
  }

  markAsPending() {
    this.props.status = 'PENDING'

    this.touch()
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

  static create(props: DeliveryProps, id?: UniqueEntityId) {
    const delivery = new Delivery(props, id)

    return delivery
  }
}
