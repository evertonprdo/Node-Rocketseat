import { Delivery } from '@/domain/delivery/entities/delivery'

export class DeliveryPresenter {
  static toHTTP(delivery: Delivery) {
    const attachmentId = delivery.attachment
      ? delivery.attachment.attachmentId.toString()
      : null

    return {
      id: delivery.id.toString(),
      receiverId: delivery.receiverId.toString(),
      status: delivery.status,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
      pickedUpDate: delivery.pickedUpAt,
      deliveredAt: delivery.deliveredAt,
      attachmentId,
    }
  }
}
