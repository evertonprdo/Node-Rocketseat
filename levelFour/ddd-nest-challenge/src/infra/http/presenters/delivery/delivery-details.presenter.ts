import { DeliveryDetails } from '@/domain/delivery/entities/value-objects/delivery-details'

export class DeliveryDetailsPresenter {
  static toHTTP(deliveryDetails: DeliveryDetails) {
    return {
      deliveryId: deliveryDetails.deliveryId.toString(),
      status: deliveryDetails.status,
      createdAt: deliveryDetails.createdAt,
      updatedAt: deliveryDetails.updatedAt,
      pickedUpAt: deliveryDetails.pickedUpAt,
      deliveredAt: deliveryDetails.deliveredAt,

      receiver: {
        id: deliveryDetails.receiver.id.toString(),
        name: deliveryDetails.receiver.name,
        cep: deliveryDetails.receiver.address.cep.toDecorated(),
        state: deliveryDetails.receiver.address.state,
        city: deliveryDetails.receiver.address.city,
        street: deliveryDetails.receiver.address.street,
        number: deliveryDetails.receiver.address.number,
        neighborhood: deliveryDetails.receiver.address.neighborhood,
      },
    }
  }
}
