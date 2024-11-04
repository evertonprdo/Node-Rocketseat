import { DeliveryAttachment } from '../entities/delivery-attachment'

export interface DeliveryAttachmentsRepository {
  findById(id: string): Promise<DeliveryAttachment | null>
  create(attachment: DeliveryAttachment): Promise<void>
}
