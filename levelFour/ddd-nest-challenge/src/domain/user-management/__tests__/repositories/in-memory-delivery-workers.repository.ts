import { DeliveryWorker } from '../../entities/delivery-worker'
import { DeliveryWorkersRepository } from '../../repositories/delivery-workers.repository'

export class InMemoryDeliveryWorkersRepository
  implements DeliveryWorkersRepository
{
  public items: DeliveryWorker[] = []

  async assign(deliveryWorker: DeliveryWorker) {
    this.items.push(deliveryWorker)
  }
}
