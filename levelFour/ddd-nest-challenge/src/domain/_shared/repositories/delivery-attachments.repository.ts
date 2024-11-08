import { DeliveryAttachment } from '../entities/value-objects/delivery-attachment'

export interface DeliveryAttachmentsRepository {
  findById(id: string): Promise<DeliveryAttachment | null>
}
