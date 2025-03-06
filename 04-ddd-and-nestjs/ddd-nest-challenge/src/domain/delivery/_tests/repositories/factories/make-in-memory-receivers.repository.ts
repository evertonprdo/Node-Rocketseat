import { InMemoryReceiversRepository } from '../in-memory-receivers.repository'

export function makeInMemoryReceiversRepository() {
  return new InMemoryReceiversRepository()
}
