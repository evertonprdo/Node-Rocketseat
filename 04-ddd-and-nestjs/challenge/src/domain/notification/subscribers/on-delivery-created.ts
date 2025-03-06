import { EventHandler } from '@/core/events/event-handler'
import { DomainEvents } from '@/core/events/domain-events'

import { DeliveryCreatedEvent } from '@/domain/admin/events/delivery-created.event'
import { CustomersRepository } from '@/domain/admin/repositories/customers.repository'

import { SendNotificationUseCase } from '../use-cases/send-notification.use-case'

export class OnDeliveryCreated implements EventHandler {
  constructor(
    private customersRepository: CustomersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewDeliveryNotification.bind(this),
      DeliveryCreatedEvent.name,
    )
  }

  private async sendNewDeliveryNotification({
    delivery,
  }: DeliveryCreatedEvent) {
    const customer = await this.customersRepository.findById(
      delivery.customerId.toString(),
    )

    if (customer) {
      await this.sendNotification.execute({
        recipientId: customer.userId.toString(),
        title: `Delivery status updated: "${delivery.status}"`,
        content: `Your delivery is now ready to be picked up by our delivery workers.`,
      })
    }
  }
}
