import { Delivery } from '@/domain/delivery/entities/delivery'

export class DeliveryPresenter {
  static toHTTP(delivery: Delivery) {
    return {
      id: delivery.id.toString(),
      receiverId: delivery.receiverId.toString(),
      status: delivery.status,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
      pickedUpDate: delivery.pickedUpDate,
      deliveredAt: delivery.deliveredAt,
    }
  }
}
