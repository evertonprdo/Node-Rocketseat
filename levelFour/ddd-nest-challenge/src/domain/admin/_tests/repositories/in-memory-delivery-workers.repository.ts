import { DeliveryWorker } from '../../entities/delivery-worker'
import { DeliveryWorkersRepository } from '../../repositories/delivery-workers.repository'

export class InMemoryDeliveryWorkersRepository
  implements DeliveryWorkersRepository
{
  public items: DeliveryWorker[] = []

  async findById(id: string) {
    const deliveryWorker = this.items.find((item) => item.id.toString() === id)

    if (!deliveryWorker) {
      return null
    }

    return deliveryWorker
  }

  async assign(deliveryWorker: DeliveryWorker) {
    this.items.push(deliveryWorker)
  }
}
