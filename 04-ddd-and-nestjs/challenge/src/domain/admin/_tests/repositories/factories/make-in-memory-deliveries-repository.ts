import { InMemoryUsersRepository } from '../in-memory-users.repository'
import { InMemoryCustomersRepository } from '../in-memory-customers.repository'
import { InMemoryDeliveriesRepository } from '../in-memory-deliveries.repository'
import { InMemoryDeliveryWorkersRepository } from '../in-memory-delivery-workers.repository'

export function makeInMemoryDeliveriesRepository() {
  const userRepository = new InMemoryUsersRepository()

  const customersRepository = new InMemoryCustomersRepository(userRepository)
  const deliveryWorkersRepository = new InMemoryDeliveryWorkersRepository(
    userRepository,
  )

  return new InMemoryDeliveriesRepository(
    customersRepository,
    deliveryWorkersRepository,
  )
}
