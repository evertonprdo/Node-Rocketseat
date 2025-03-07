import { Notification } from '@/domain/notification/entities/notification'

export class NotificationPresenter {
  static toHTTP(notification: Notification) {
    return {
      recipientId: notification.recipientId.toString(),
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    }
  }
}
