import { DeliveryDetails } from '@/domain/delivery/entities/value-objects/delivery-details'

export class DeliveryDetailsPresenter {
  static toHTTP(deliveryDetails: DeliveryDetails) {
    const attachment = deliveryDetails.attachment
      ? {
          id: deliveryDetails.attachment.id.toString(),
          title: deliveryDetails.attachment.title,
          url: deliveryDetails.attachment.url,
        }
      : null

    return {
      deliveryId: deliveryDetails.deliveryId.toString(),
      status: deliveryDetails.status,
      createdAt: deliveryDetails.createdAt,
      updatedAt: deliveryDetails.updatedAt,
      pickedUpAt: deliveryDetails.pickedUpAt,
      deliveredAt: deliveryDetails.deliveredAt,
      attachment,

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
