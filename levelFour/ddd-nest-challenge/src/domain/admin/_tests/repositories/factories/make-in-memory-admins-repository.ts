import { makeInMemoryUsersRepository } from './make-in-memory-users-repository'

import { InMemoryAdminsRepository } from '../in-memory-admins.repository'

export function makeInMemoryAdminsRepository() {
  const usersRepository = makeInMemoryUsersRepository()

  return new InMemoryAdminsRepository(usersRepository)
}
