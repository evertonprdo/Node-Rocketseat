import { InMemoryDeliveriesRepository } from '../in-memory-deliveries.repository'

export function makeInMemoryDeliveriesRepository() {
  return new InMemoryDeliveriesRepository()
}
