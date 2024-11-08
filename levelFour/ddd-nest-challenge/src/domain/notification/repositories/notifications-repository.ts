import { Notification } from '../entities/notification'

export interface NotificationsRepository {
  findById(notification: string): Promise<Notification | null>
  create(notification: Notification): Promise<void>
  save(notification: Notification): Promise<void>
}
