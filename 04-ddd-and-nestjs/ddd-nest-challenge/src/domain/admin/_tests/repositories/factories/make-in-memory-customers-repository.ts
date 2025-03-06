import { InMemoryCustomersRepository } from '../in-memory-customers.repository'
import { InMemoryUsersRepository } from '../in-memory-users.repository'

export function makeInMemoryCustomersRepository() {
  const usersRepository = new InMemoryUsersRepository()

  return new InMemoryCustomersRepository(usersRepository)
}
