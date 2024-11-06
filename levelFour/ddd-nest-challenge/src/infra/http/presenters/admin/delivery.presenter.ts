import { Delivery } from '@/domain/admin/entities/delivery'

export class DeliveryPresenter {
  static toHTTP(delivery: Delivery) {
    return {
      id: delivery.id.toString(),
      status: delivery.status,
      customerId: delivery.customerId.toString(),
      createdAt: delivery.createdAt,
      deliveryWorkerId: delivery.deliveryWorkerId
        ? delivery.deliveryWorkerId.toString()
        : null,
      pickedUpAt: delivery.pickedUpAt,
      deliveredAt: delivery.deliveredAt,
      updatedAt: delivery.updatedAt,
    }
  }
}
