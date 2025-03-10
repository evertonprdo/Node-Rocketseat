import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationsRepository {
  abstract findById(notification: string): Promise<Notification | null>
  abstract create(notification: Notification): Promise<void>
  abstract save(notification: Notification): Promise<void>
}
