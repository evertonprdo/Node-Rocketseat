import { Receiver } from '../../entities/receiver'
import { ReceiversRepository } from '../../repositories/receivers.repository'

export class InMemoryReceiversRepository implements ReceiversRepository {
  public items: Receiver[] = []

  async findById(id: string) {
    const receiver = this.items.find((item) => item.id.toString() === id)

    if (!receiver) {
      return null
    }

    return receiver
  }
}
