import { makeInMemoryUsersRepository } from './make-in-memory-users-repository'

import { InMemoryDeliveryWorkersRepository } from '../in-memory-delivery-workers.repository'

export function makeInMemoryDeliveryWorkersRepository() {
  const usersRepository = makeInMemoryUsersRepository()

  return new InMemoryDeliveryWorkersRepository(usersRepository)
}
