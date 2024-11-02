import { InMemoryDeliveryWorkersRepository } from '../in-memory-delivery-workers.repository'

export function makeInMemoryDeliveryWorkersRepository() {
  return new InMemoryDeliveryWorkersRepository()
}
