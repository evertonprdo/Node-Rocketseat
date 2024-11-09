import { EventHandler } from '@/core/events/event-handler'
import { DomainEvents } from '@/core/events/domain-events'

import { CustomersRepository } from '@/domain/admin/repositories/customers.repository'

import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DeliveryStatusUpdatedEvent } from '@/domain/delivery/events/delivery-status-updated.event'

export class OnDeliveryStatusUpdated implements EventHandler {
  constructor(
    private customersRepository: CustomersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewDeliveryNotification.bind(this),
      DeliveryStatusUpdatedEvent.name,
    )
  }

  private async sendNewDeliveryNotification({
    delivery,
  }: DeliveryStatusUpdatedEvent) {
    const receiver = await this.customersRepository.findById(
      delivery.receiverId.toString(),
    )

    const messages = {
      PICKED_UP:
        'Your delivery has already been picked up and will be delivered soon.',
      DELIVERED:
        'Congratulations! Your delivery has been successfully delivered.',
      RETURNED: 'Unfortunately, your delivery was returned.',
    }

    if (receiver) {
      await this.sendNotification.execute({
        recipientId: receiver.userId.toString(),
        title: `Delivery status updated: "${delivery.status}"`,
        content: messages[delivery.status],
      })
    }
  }
}
