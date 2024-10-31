import { InMemoryCustomersRepository } from '../in-memory-customers.repository'

export function makeInMemoryCustomersRepository() {
  return new InMemoryCustomersRepository()
}
