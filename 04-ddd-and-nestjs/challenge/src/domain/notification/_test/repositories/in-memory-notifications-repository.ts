import { Notification } from '../../entities/notification'
import {
  FindManyByRecipientIdParams,
  NotificationsRepository,
} from '../../repositories/notifications.repository'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toString() === id)

    if (!notification) {
      return null
    }

    return notification
  }

  async findManyByRecipientId({
    page,
    recipientId,
    unreadyOnly,
  }: FindManyByRecipientIdParams) {
    const notifications = this.items
      .filter((item) => item.recipientId.toString() === recipientId)
      .filter((item) => !!item.readAt === unreadyOnly)

    const take = 20
    return notifications.slice((page - 1) * take, page * take)
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    )

    this.items[itemIndex] = notification
  }
}
