import { DeliveryAttachment } from '../../entities/value-objects/delivery-attachment'
import { DeliveryAttachmentsRepository } from '../../repositories/delivery-attachments.repository'

export class InMemoryDeliveryAttachmentsRepository
  implements DeliveryAttachmentsRepository
{
  public items: DeliveryAttachment[] = []

  async findById(id: string) {
    const deliveryAttachment = this.items.find(
      (item) => item.attachmentId.toString() === id,
    )

    if (!deliveryAttachment) {
      return null
    }

    return deliveryAttachment
  }
}
