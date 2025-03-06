import { DeliveryWorkerDetails } from '@/domain/admin/entities/values-objects/delivery-worker-details'

export class DeliveryWorkerDetailsPresenter {
  static toHTTP(deliveryWorker: DeliveryWorkerDetails) {
    return {
      deliveryWorkerId: deliveryWorker.deliveryWorkerId.toString(),
      userId: deliveryWorker.userId.toString(),
      cpf: deliveryWorker.cpf.toDecorated(),
      name: deliveryWorker.name,
      operationZone: deliveryWorker.operationZone,
      phone: deliveryWorker.phone,
    }
  }
}
