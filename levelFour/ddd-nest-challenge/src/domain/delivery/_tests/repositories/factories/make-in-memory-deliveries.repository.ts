import { InMemoryDeliveriesRepository } from '../in-memory-deliveries.repository'
import { InMemoryReceiversRepository } from '../in-memory-receivers.repository'
import { InMemoryDeliveryWorkersRepository } from '../in-memory-delivery-workers.repository'

export function makeInMemoryDeliveriesRepository() {
  const receiversRepository = new InMemoryReceiversRepository()
  const deliveryWorkersRepository = new InMemoryDeliveryWorkersRepository()

  return new InMemoryDeliveriesRepository(
    deliveryWorkersRepository,
    receiversRepository,
  )
}
