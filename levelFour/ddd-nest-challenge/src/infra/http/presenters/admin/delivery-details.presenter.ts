import { DeliveryDetails } from '@/domain/admin/entities/values-objects/delivery-details'

export class DeliveryDetailsPresenter {
  static toHTTP(deliveryDetails: DeliveryDetails) {
    const address = {
      cep: deliveryDetails.customer.address.cep.toDecorated(),
      state: deliveryDetails.customer.address.state,
      city: deliveryDetails.customer.address.city,
      street: deliveryDetails.customer.address.street,
      number: deliveryDetails.customer.address.number,
      neighborhood: deliveryDetails.customer.address.neighborhood,
    }

    const deliveryWorker = deliveryDetails.deliveryWorker
      ? {
          id: deliveryDetails.deliveryWorker.id.toString(),
          name: deliveryDetails.deliveryWorker.name,
          cpf: deliveryDetails.deliveryWorker.cpf.toDecorated(),
          phone: deliveryDetails.deliveryWorker.phone,
          operationZone: deliveryDetails.deliveryWorker.operationZone,
        }
      : null

    return {
      deliveryId: deliveryDetails.deliveryId.toString(),
      status: deliveryDetails.status,
      createdAt: deliveryDetails.createdAt ?? null,
      pickedUpAt: deliveryDetails.pickedUpAt ?? null,
      updatedAt: deliveryDetails.updatedAt ?? null,

      customer: {
        id: deliveryDetails.customer.id.toString(),
        name: deliveryDetails.customer.name,
        email: deliveryDetails.customer.email,
        address,
      },

      deliveryWorker,
    }
  }
}
