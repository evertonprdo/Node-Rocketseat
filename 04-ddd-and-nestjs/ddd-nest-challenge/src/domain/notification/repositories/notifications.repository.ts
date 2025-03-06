import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'
import { Notification } from '../entities/notification'

export interface FindManyByRecipientIdParams extends PaginationParams {
  recipientId: string
  unreadyOnly: boolean
}

export interface NotificationsRepository {
  findById(id: string): Promise<Notification | null>

  findManyByRecipientId(
    params: FindManyByRecipientIdParams,
  ): Promise<Notification[]>

  create(notification: Notification): Promise<void>
  save(notification: Notification): Promise<void>
}
