import { InMemoryUsersRepository } from '../in-memory-users.repository'

export function makeInMemoryUsersRepository() {
  return new InMemoryUsersRepository()
}
