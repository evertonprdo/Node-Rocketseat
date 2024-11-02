import { DeliveryWorker } from '../../entities/delivery-worker'
import { DeliveryWorkersRepository } from '../../repositories/delivery-workers.repository'

export class InMemoryDeliveryWorkersRepository
  implements DeliveryWorkersRepository
{
  public items: DeliveryWorker[] = []

  async findById(id: string) {
    const receiver = this.items.find((item) => item.id.toString() === id)

    if (!receiver) {
      return null
    }

    return receiver
  }
}
