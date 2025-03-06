import { DomainEvent } from '@/core/events/domain-event'
import { Delivery } from '../entities/delivery'

export class DeliveryStatusUpdatedEvent implements DomainEvent {
  public ocurredAt: Date
  public delivery: Delivery

  constructor(delivery: Delivery) {
    this.delivery = delivery
    this.ocurredAt = new Date()
  }

  getAggregateId() {
    return this.delivery.id
  }
}
