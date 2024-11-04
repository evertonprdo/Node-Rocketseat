import { DeliveryAttachment } from '../../entities/delivery-attachment'
import { DeliveryAttachmentsRepository } from '../../repositories/delivery-attachments.repository'

export class InMemoryDeliveryAttachmentsRepository
  implements DeliveryAttachmentsRepository
{
  public items: DeliveryAttachment[] = []

  async findById(id: string) {
    const deliveryAttachment = this.items.find(
      (item) => item.id.toString() === id,
    )

    if (!deliveryAttachment) {
      return null
    }

    return deliveryAttachment
  }

  async create(attachment: DeliveryAttachment) {
    this.items.push(attachment)
  }
}
